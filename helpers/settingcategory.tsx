import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ModalState } from "../pages/dashboard";
import styles from "../styles/Dashboard.module.scss";
import { remBackendURL } from "./config";
import { importMee6 } from "./settings/levels";
import { Guild } from "./util/discordUtil";


export function SettingCategory(props:{ guild:Guild, category?:string, setCategory:Dispatch<SetStateAction<string | undefined>>, setModal:Dispatch<SetStateAction<ModalState>> }) {

	const {guild, category, setCategory, setModal} = props;

	useEffect(() => {
		setCategory("");
	}, [guild, setCategory])

	if (!category) return <SettingList setCategory={setCategory} />
	return <SettingContent guildID={guild.guild.id} settingDetails={settings[category]} setModal={setModal}/>
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

function SettingContent(props:{guildID:string, settingDetails:SettingObject, setModal:Dispatch<SetStateAction<ModalState>>}) {
	const {guildID, settingDetails, setModal} = props;
	return (
		<div className={styles.settingcategory}>
			<h3 className={styles.settingtitle}>{settingDetails.name}</h3>
			<Commands guildID={guildID} commands={settingDetails.commands}/>
      <Buttons guildID={guildID} buttons={settingDetails.buttons} setModal={setModal} />
		</div>
	);
}

function Commands(props:{guildID:string, commands:Command[]}) {
	const {guildID, commands} = props;
	if (commands.length === 0) return <></>;
	return (
		<ul className={styles.commandlist}>{
			commands.map((command, index) => {
				return (
					<li key={index} className={styles.command}><CommandElement guildID={guildID} command={command} /></li>
				)
			})
		}</ul>
	)
}

function CommandElement(props:{ guildID:string, command:Command }) {
	const { guildID, command } = props;
	return (
		<div>
			<h4 className={styles.commandname}>{command.name}</h4>
			<p className={styles.commanddescription}>{command.description}</p>
			<Subcommands guildID={guildID} command={command} />
		</div>
	)
}

function Subcommands(props:{ guildID:string, command:Command }) {
	const { guildID, command } = props;
	if (command.subcommands.length === 0) return <></>;
	return (
		<ul className={styles.subcommandlist}>{
			command.subcommands.map((subcommand, index) => {
				return (
					<li key={index} className={styles.subcommand}><SubcommandElement guildID={guildID} command={command} subcommand={subcommand} /></li>
				)
			})
		}</ul>
	)
}

function SubcommandElement(props:{ guildID:string, command:Command, subcommand:Subcommand }) {
	const { guildID, command, subcommand } = props;
	return (
    <label htmlFor={`${command.name}-${subcommand.name}`}>
		  <div className={styles.subcommandcontainer}>
        <SubcommandToggle guildID={guildID} command={command} subcommand={subcommand} />
        <div className={styles.subcommandcontent}>
          <h4 className={styles.subcommandname}>{subcommand.name}</h4>
          <p className={styles.subcommanddescription}>{subcommand.description}</p>
          <p>Parent command: {command.name}</p>
        </div>
		  </div>
    </label>
	)
}

async function updateCommand(guildID:string, commandName:string) {
  const subCommands = [...document.querySelectorAll(`.${styles.subcommandtoggle}[data-command=${commandName}]:checked`)].map((subCommand) => {
    return `${commandName}${subCommand.getAttribute("data-subcommand")}`;
  })
  const userID = localStorage.getItem("userID");
  const token = Number(localStorage.getItem("token"));
  await fetch(`${remBackendURL}/interaction`, {
    method: "POST",
    body: JSON.stringify({
      name: commandName,
      subCommands,
      guildID: guildID,
      userID,
      token,
      defaultPermission: true
    })
  })
}

function SubcommandToggle(props:{ guildID:string, command:Command, subcommand:Subcommand }) {
	const { guildID, command, subcommand } = props;
	return (
		<input type="checkbox" className={styles.subcommandtoggle} data-command={command.name} data-subcommand={subcommand.name} onChange={()=> {updateCommand(guildID, command.name)}} id={`${command.name}-${subcommand.name}`} />
	)
}

function Buttons(props:{ guildID:string, buttons:Button[]|undefined, setModal:Dispatch<SetStateAction<ModalState>> }) {
  const {guildID, buttons, setModal} = props;
  if (!buttons?.length) return <></>;
  return (
    <ul className={styles.buttonlist}>{
      buttons.map((button, index) => {
        return (
          <li key={index}><ButtonElement guildID={guildID} button={button} setModal={setModal} /></li>
        )
      })
    }</ul>
  )
}

function ButtonElement(props:{ guildID:string, button:Button, setModal:Dispatch<SetStateAction<ModalState>> }) {
  const { guildID, button, setModal } = props;
  let [buttonResponse, setButtonResponse] = useState<ButtonResponse>();
  return (
    <div className={styles.buttoncontainer}>
      <button name={button.name} className={styles.button} onClick={()=>{buttonCaller(guildID, button, setButtonResponse, setModal)}}>{button.name}</button>
      {buttonResponse?.message ? <p className={`${styles.buttonmessage} ${buttonSuccessClass(buttonResponse)}`}>{buttonResponse.message}</p> : <></>}
      <p className={styles.buttondescription}>{button.description}</p>
    </div>
  );
}

function buttonSuccessClass(buttonResponse:ButtonResponse|undefined) {
  if (typeof buttonResponse === "undefined") return "";;
  if (buttonResponse.success) return styles.buttonsuccess;
  return styles.buttonerror;
}

const levels:SettingObject = {
	name: "Levels",
	description: "Add levelling commands to the server. Every minute, a user will gain 15-25xp in the server when they send a message. You can give bonuses based on levels.",
	commands: [
		{
			name: "level",
			description: "Adds level viewing functionality to the bot.",
			subcommands: [{
				name: "display",
				description: "Show the level of a specific user."
			}]
		}
	],
  buttons: [
    {
      name: "import from MEE6",
      description: "Import levels and role settings from MEE6. This will overwrite any existing levels and role settings. You must make your leaderboard public in the MEE6 leaderboard before importing, or it will fail.",
      isDestructive: true,
      action: importMee6
    }
  ]
}

async function confirmModal(content:string, setModal:Dispatch<SetStateAction<ModalState>>) {
  return new Promise((resolve, reject) => {
    setModal({
      visible: true,
      content: (
        <div>
          <h1>Warning</h1>
          <p>{content}</p>
          <div className={styles.buttoncontainer}>
            <button className={`${styles.button} ${styles.confirm}`} onClick={()=>{setModal({visible:false, content:<></>}); resolve(true)}}>Confirm</button>
            <button className={`${styles.button} ${styles.cancel}`} onClick={()=>{setModal({visible:false, content:<></>}); resolve(false)}}>Cancel</button>
          </div>
        </div>
      )
    });
  });
  
}

async function buttonCaller(guildID:string, button:Button, setButtonResponse:Dispatch<SetStateAction<ButtonResponse | undefined>>, setModal:Dispatch<SetStateAction<ModalState>>) {
  if (button.isDestructive) {
    const response = await confirmModal(`Are you sure you want to ${button.name}? This will: ${button.description}`, setModal);
    if (!response) return;
  }
  setButtonResponse(await button.action(guildID));
}

interface ButtonResponse {
  success: boolean;
  message: string;
}

interface Subcommand {
	name:string;
	description:string;
}

interface Command extends Subcommand {
	subcommands:Subcommand[];
}

interface Button {
  name:string;
  description:string;
  isDestructive:boolean;
  action:(guildID:string) => Promise<ButtonResponse>;
}
interface SettingObject extends Subcommand {
	commands:Command[];
  buttons?:Button[];
}

const settings:{[setting:string]:SettingObject} = {
	"Levels": levels,
}
