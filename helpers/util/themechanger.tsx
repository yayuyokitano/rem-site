import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from '@mui/icons-material/DarkMode';

interface ThemeChangerProps {
  resolvedTheme: string|undefined;
  setTheme: (theme:string) => void;
  buttonClass: string;
}

interface ThemeIconProps {
  resolvedTheme:string|undefined;
}

const getNewTheme = (theme:string|undefined) => theme === "dark" ? "light" : "dark";

export function ThemeChanger(props:ThemeChangerProps) {
  return (
    <button name="theme" aria-label="theme" className={props.buttonClass} onClick={() => {props.setTheme(getNewTheme(props.resolvedTheme))}}>
      <ThemeIcon resolvedTheme={props.resolvedTheme} />
    </button>
  )
}

function ThemeIcon(props:ThemeIconProps) {
  return props.resolvedTheme === "dark" ?
    <LightModeIcon /> :
    <DarkModeIcon />;
}