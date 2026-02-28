import { Divider, Flex, Stack, Tabs, Text } from "@mantine/core";
import { OptionField, OptionHandlerContext } from "../OptionPanel";
import { InputField } from "../impl/InputField";

const DefaultEmbed = {
  title: "",
  description: "",
  url: "",
  color: "",
  thumbnail: "",
  author: { name: "", link: "", icon: "" },
  footer: "",
  fields: [],
};

const DefaultMessage = "";

const handler = {
  _embed_field: (props) => <EmbedField {...props} />,
};

export default function MessageBuildCard({ value, onChange }) {
  const get = (name) => value != null && value[name];

  const data = {
    type: get("type") || "message",
    message: get("message") || DefaultMessage,
    embed: get("embed") || DefaultEmbed,
  };

  return (
    <Tabs defaultValue={data.type === "message" ? "message" : "embed"}>
      <Tabs.List>
        <Tabs.Tab value="message">Message</Tabs.Tab>
        <Tabs.Tab value="embed">Embed</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="message" pt="sm">
        <MessagePanel data={data} onChange={onChange} />
      </Tabs.Panel>
      <Tabs.Panel value="embed" pt="sm">
        <EmbedPanel data={data} onChange={onChange} />
      </Tabs.Panel>
    </Tabs>
  );
}

function MessagePanel({ data, onChange }) {
  const onType = (v) => {
    onChange({ ...data, message: v });
  };

  return (
    <div>
      <label htmlFor="content">Content</label>
      <InputField
        id="content"
        placeholder="YEEE"
        value={data.message}
        onChange={(event) => onType(event.target.value)}
      />
      <Text fz="xs" c="dimmed" mt={4}>
        Content cannot be empty
      </Text>
    </div>
  );
}

function EmbedPanel({ data, onChange }) {
  const embed = data.embed;

  const update = (name, v) => {
    onChange({ ...data, embed: { ...embed, [name]: v } });
  };

  const updateAuthor = (name, v) => {
    update("author", { ...embed.author, [name]: v });
  };

  const info = {
    name: "Basic Settings",
    fields: [
      { name: "Title", id: "title", type: "string" },
      { name: "Description", id: "detail", type: "long_string" },
      { name: "URL", id: "url", type: "string" },
      { name: "Footer", id: "footer", type: "string" },
      { name: "Color", id: "color", type: "color" },
    ],
    mapper(field) {
      return (
        <Field head key={field.id} option={field} value={embed[field.id]} onChange={(v) => update(field.id, v)} />
      );
    },
  };

  const advanced = {
    name: "Advanced Settings",
    fields: [
      {
        name: "Fields",
        id: "fields",
        type: "array",
        element: {
          type: "_embed_field",
          holder: { name: "", value: "", inline: false },
        },
      },
    ],
    mapper(field) {
      return (
        <Field head key={field.id} option={field} value={embed[field.id]} onChange={(v) => update(field.id, v)} />
      );
    },
  };

  const author = {
    name: "Author Settings",
    fields: [
      { id: "name", name: "Name", type: "string" },
      { id: "link", name: "URL", type: "string" },
      { id: "icon", name: "Icon", type: "string" },
    ],
    mapper(field) {
      return (
        <Field
          head
          key={field.id}
          option={field}
          value={embed.author[field.id]}
          onChange={(v) => updateAuthor(field.id, v)}
        />
      );
    },
  };

  return (
    <div>
      <OptionHandlerContext.Provider value={handler}>
        <Category {...info} isFirst />
        <Category {...author} />
        <Category {...advanced} />
      </OptionHandlerContext.Provider>
    </div>
  );
}

function Category({ isFirst, name, fields, mapper }) {
  return (
    <Stack>
      {!isFirst && <Divider my="md" />}
      <Text fz="xl" fw="bold" my="sm">
        {name}
      </Text>
      <Stack gap="sm">{fields.map(mapper)}</Stack>
    </Stack>
  );
}

function Field({ option, value, onChange, head }) {
  return (
    <>
      <Text style={{ wordBreak: "keep-all" }} fz={head ? "lg" : undefined} fw={head ? "bold" : undefined}>
        {option.name}
      </Text>
      <OptionField value={value} onChange={onChange} option={option} />
    </>
  );
}

function EmbedField({ value, onChange }) {
  const change = (name, v) => {
    onChange({ ...value, [name]: v });
  };

  return (
    <Flex w="100%" direction={{ base: "column", md: "row" }} align={{ md: "baseline" }} gap="sm">
      <Field option={{ name: "Name", type: "string" }} value={value.name} onChange={(v) => change("name", v)} />
      <Field option={{ name: "Value", type: "string" }} value={value.value} onChange={(v) => change("value", v)} />
      <Flex w="100%" direction="row-reverse" align="baseline">
        <Field
          option={{ name: "Inline", type: "boolean" }}
          value={value.inline}
          onChange={(v) => change("inline", v)}
        />
      </Flex>
    </Flex>
  );
}