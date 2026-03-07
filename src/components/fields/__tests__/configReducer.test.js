import { describe, it, expect } from 'vitest';
import { configReducer, runValidation, MAX_HISTORY } from '../ConfigPanel';

function createInitialState(values = {}) {
    const changes = new Map(Object.entries(values));
    return { changes, errors: new Map(), past: [], future: [] };
}

describe('configReducer', () => {
    const options = [
        { id: 'name', name: 'Name', type: 'string', required: true },
        { id: 'color', name: 'Color', type: 'string' },
    ];

    it('should set a value and record change', () => {
        const state = createInitialState({ name: 'hello' });
        const next = configReducer(state, {
            type: 'SET_VALUE',
            id: 'color',
            value: '#ff0000',
            options,
        });

        expect(next.changes.get('color')).toBe('#ff0000');
        expect(next.changes.get('name')).toBe('hello');
        expect(next.past).toHaveLength(1);
        expect(next.future).toHaveLength(0);
    });

    it('should validate required fields', () => {
        const state = createInitialState({ name: 'hello' });
        const next = configReducer(state, {
            type: 'SET_VALUE',
            id: 'name',
            value: '',
            options,
        });

        expect(next.errors.has('name')).toBe(true);
        expect(next.errors.get('name')).toBe('Name is required');
    });

    it('should clear error when valid value provided', () => {
        const state = createInitialState({ name: '' });
        state.errors.set('name', 'Name is required');

        const next = configReducer(state, {
            type: 'SET_VALUE',
            id: 'name',
            value: 'valid',
            options,
        });

        expect(next.errors.has('name')).toBe(false);
    });

    it('should undo last change', () => {
        let state = createInitialState({ name: 'original' });
        state = configReducer(state, { type: 'SET_VALUE', id: 'name', value: 'changed', options });
        expect(state.changes.get('name')).toBe('changed');

        state = configReducer(state, { type: 'UNDO' });
        expect(state.changes.get('name')).toBe('original');
        expect(state.past).toHaveLength(0);
        expect(state.future).toHaveLength(1);
    });

    it('should redo after undo', () => {
        let state = createInitialState({ name: 'original' });
        state = configReducer(state, { type: 'SET_VALUE', id: 'name', value: 'changed', options });
        state = configReducer(state, { type: 'UNDO' });
        state = configReducer(state, { type: 'REDO' });

        expect(state.changes.get('name')).toBe('changed');
        expect(state.future).toHaveLength(0);
        expect(state.past).toHaveLength(1);
    });

    it('should clear future on new change after undo', () => {
        let state = createInitialState({ name: 'a' });
        state = configReducer(state, { type: 'SET_VALUE', id: 'name', value: 'b', options });
        state = configReducer(state, { type: 'UNDO' });
        expect(state.future).toHaveLength(1);

        state = configReducer(state, { type: 'SET_VALUE', id: 'name', value: 'c', options });
        expect(state.future).toHaveLength(0);
        expect(state.changes.get('name')).toBe('c');
    });

    it('should do nothing when undo with empty history', () => {
        const state = createInitialState({ name: 'a' });
        const next = configReducer(state, { type: 'UNDO' });
        expect(next).toBe(state);
    });

    it('should do nothing when redo with empty future', () => {
        const state = createInitialState({ name: 'a' });
        const next = configReducer(state, { type: 'REDO' });
        expect(next).toBe(state);
    });

    it('should reset state', () => {
        let state = createInitialState({ name: 'a' });
        state = configReducer(state, { type: 'SET_VALUE', id: 'name', value: 'b', options });
        state = configReducer(state, { type: 'SET_VALUE', id: 'color', value: 'red', options });

        const initial = new Map([['name', 'a']]);
        state = configReducer(state, { type: 'RESET', initial });

        expect(state.changes).toBe(initial);
        expect(state.past).toHaveLength(0);
        expect(state.future).toHaveLength(0);
        expect(state.errors.size).toBe(0);
    });

    it('should limit history to MAX_HISTORY entries', () => {
        let state = createInitialState({ name: '0' });
        for (let i = 1; i <= 35; i++) {
            state = configReducer(state, {
                type: 'SET_VALUE',
                id: 'name',
                value: String(i),
                options,
            });
        }

        expect(state.past.length).toBeLessThanOrEqual(MAX_HISTORY);
        expect(state.past).toHaveLength(MAX_HISTORY);
    });
});
