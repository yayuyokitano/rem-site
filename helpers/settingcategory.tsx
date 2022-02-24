import { Dispatch, SetStateAction, useEffect } from "react";
import styles from "../styles/Dashboard.module.scss";
import { Guild } from "./util/discordUtil";


export function SettingCategory(props:{ guild:Guild, category?:string, setCategory:Dispatch<SetStateAction<string | undefined>> }) {

  const {guild, category, setCategory} = props;

  useEffect(() => {
    setCategory("");
  }, [guild])

  if (!category) return <SettingList setCategory={setCategory} />
  return <SettingContent settingDetails={settings[category]}/>
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

function SettingContent(props:{settingDetails:SettingObject}) {
  const {settingDetails} = props;
  return (
    <div className={styles.settingcategory}>
      <h3 className={styles.settingtitle}>{settingDetails.name}</h3>
      <Commands commands={settingDetails.commands}/>
    </div>
  );
}

function Commands(props:{commands:Command[]}) {
  const {commands} = props;
  if (commands.length === 0) return <></>;
  return (
    <ul className={styles.commandList}>{
      commands.map((command, index) => {
        return (
          <li key={index} className={styles.command}><CommandElement command={command} /></li>
        )
      })
    }</ul>
  )
}

function CommandElement(props:{ command:Command }) {
  const { command } = props;
  return (
    <div>
      <h4 className={styles.commandname}>{command.name}</h4>
      <p className={styles.commanddescription}>{command.description}</p>
      <Subcommands command={command} />
    </div>
  )
}

function Subcommands(props:{ command:Command }) {
  const { command } = props;
  if (command.subcommands.length === 0) return <></>;
  return (
    <ul className={styles.subcommandlist}>{
      command.subcommands.map((subcommand, index) => {
        return (
          <li key={index} className={styles.subcommand}><SubcommandElement command={command} subcommand={subcommand} /></li>
        )
      })
    }</ul>
  )
}

function SubcommandElement(props:{ command:Command, subcommand:Subcommand }) {
  const { command, subcommand } = props;
  return (
    <div>
      <h4 className={styles.subcommandname}>{subcommand.name}</h4>
      <p className={styles.subcommanddescription}>{subcommand.description}</p>
      <p>Parent command: {command.name}</p>
    </div>
  )
}

const levels:SettingObject = {
  name: "Levels",
  description: "Add levelling commands to the server. Every minute, a user will gain 15-25xp in the server when they send a message. You can give bonuses based on levels.",
  commands: [
    {
      name: "level",
      description: "Activate the level command. The base command allows the user to show their own level, or pass another user to show that user's level.",
      subcommands: [{
        name: "leaderboard",
        description: "Show a leaderboard of user levels on the server."
      }]
    }
  ]
}

interface Subcommand {
  name:string;
  description:string;
}

interface Command extends Subcommand {
  subcommands:Subcommand[];
}

interface SettingObject extends Subcommand {
  commands:Command[];
}

const settings:{[setting:string]:SettingObject} = {
  "Levels": levels,
}
