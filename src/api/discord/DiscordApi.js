import {fetchAuto} from "../utils";
import {useQuery} from "@tanstack/react-query";

export async function getAccountInfo() {
  return await fetchAuto(`/users/@me`, {toJson: true})
}

export async function getGuilds() {
  return await fetchAuto(`/guilds`, {toJson: true})
}

export async function getGuild(id) {
  return await fetchAuto(`/guild/${id}`, {toJson: true})
}

export function bannerToUrl(id, hash) {
  const ext = hash?.startsWith('a_') ? 'gif' : 'png';
  return `https://cdn.discordapp.com/banners/${id}/${hash}.${ext}?size=1024`;
}
export function avatarToUrl(id, hash) {
  const ext = hash?.startsWith('a_') ? 'gif' : 'png';
  return `https://cdn.discordapp.com/avatars/${id}/${hash}.${ext}?size=512`;
}

export function iconToUrl(id, hash) {
  const ext = hash?.startsWith('a_') ? 'gif' : 'png';
  return `https://cdn.discordapp.com/icons/${id}/${hash}.${ext}?size=256`;
}

export function useGuild(id) {
  return useQuery({
      queryKey: ["guild", id],
      queryFn: () => getGuild(id),
      refetchOnWindowFocus: false
  })
}

export function useGuilds() {
  return useQuery({
      queryKey: ["user_guilds"],
      queryFn: () => getGuilds(),
      refetchOnWindowFocus: false,
  })
}