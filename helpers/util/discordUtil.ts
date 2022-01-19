export function avatarURL(userID:string, avatar:string) {
  if (avatar.startsWith("a_")) {
    return `https://cdn.discordapp.com/avatars/${userID}/${avatar}.gif`;
  } else {
    return `https://cdn.discordapp.com/avatars/${userID}/${avatar}.webp?size=160`
  }
};