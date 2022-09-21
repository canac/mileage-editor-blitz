import { FontAwesomeIcon, type FontAwesomeIconProps } from "@fortawesome/react-fontawesome";

// This component wraps FontAwesomeIcon simply to manually set the height of
// the icon so that it is not a weird size on page load until JavaScript runs
export function FaIcon(props: FontAwesomeIconProps): JSX.Element {
  return <FontAwesomeIcon style={{ height: "1em" }} {...props} />;
}
