import { remBackendURL } from "../config";

export async function importMee6(guildID:string) {
  const callerID = localStorage.getItem("userID");
  const token = Number(localStorage.getItem("token"));
  const res = await fetch(
    `${remBackendURL}/modify-levels`, {
      method: "POST",
      body: JSON.stringify({
        callerID,
        token,
        guildID,
        operation: "import",
        source: "MEE6"
      })
    }
  )
  const content = await res.text();
  if (content === "Failed to modify levels: MEE6AuthError") {
    return {
      success: false,
      message: "MEE6 leaderboard is not public, please make it public before importing."
    }
  }
  if (!res.ok) {
    return {
      success: false,
      message: "Error importing MEE6 leaderboard."
    }
  }
  return {
    success: true,
    message: "Successfully imported MEE6 leaderboard."
  }
}

export async function resetLevels(guildID:string) {
  const callerID = localStorage.getItem("userID");
  const token = Number(localStorage.getItem("token"));
  const res = await fetch(
    `${remBackendURL}/modify-levels`, {
      method: "POST",
      body: JSON.stringify({
        callerID,
        token,
        guildID,
        operation: "reset"
      })
    }
  )
  if (!res.ok) {
    return {
      success: false,
      message: "Error resetting levels."
    }
  }
  return {
    success: true,
    message: "Successfully resetted levels."
  }
}