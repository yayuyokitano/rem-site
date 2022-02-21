import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "../styles/Dashboard.module.scss";
import { Guild } from "./util/discordUtil";


export function SettingCategory(props:{ guild:Guild, category?:string, setCategory:Dispatch<SetStateAction<string | undefined>> }) {

  const {guild, category, setCategory} = props;

  useEffect(() => {
    setCategory("");
  }, [guild])

  if (!category) return <SettingList setCategory={setCategory} />
  return (
    <div className={styles.settingcategory}>
      <h3 className={styles.settingtitle}>{category}</h3>
    </div>
  )
}

function SettingList(props: {setCategory:Dispatch<SetStateAction<string | undefined>>}) {
  const {setCategory} = props;
  return (
    <ul className={styles.settinglist}>{
      Object.keys(settings).map((setting, index) => {
        if (!settings.hasOwnProperty(setting)) return <></>;
        return (
          <li key={index} className={styles.settinglistitem} onClick={() => {setCategory(setting)}}>
            <span className={styles.settingname}>{setting}</span>
            <span className={styles.settingdescription}>{settings[setting].description}</span>
          </li>
      )})
    }</ul>
  )
}

const levels:SettingObject = {
  description: "Add levelling commands to the server. Every minute, a user will gain 15-25xp in the server when they send a message. You can give bonuses based on levels."
}

interface SettingObject {
  description:string
}

const settings:{[setting:string]:SettingObject} = {
  "Levels": levels
}
