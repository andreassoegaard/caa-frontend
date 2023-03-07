import { PropsWithChildren, useMemo } from "react";
import LoadingSpinner from "./Ui/LoadingSpinner";

interface PageButton {
  type?: "submit" | undefined;
  form?: string;
  style?: string;
  loading?: boolean;
  className?: string;
  onClick?(event: any): void;
}

export default function PageButton(props: PropsWithChildren<PageButton>) {
  const classNames = (...classes: string[]) => {
    return classes.join(" ");
  };
  const buttonClasses = useMemo(() => {
    const classes = [
      "caa-button",
      props.style ? `caa-button--style-${props.style}` : "",
    ];
    return classes.join(" ");
  }, [props.style]);

  const spinnerColor = useMemo(() => {
    if (props.style === "red") {
      return "red";
    } else {
      return "black";
    }
  }, [props.style]);
  return (
    <button
      type={props.type}
      form={props.form}
      className={classNames(
        buttonClasses,
        props.className ? props.className : ""
      )}
      disabled={props.loading}
      onClick={props.onClick}
    >
      {props.loading && <LoadingSpinner color={spinnerColor} />}
      {props.children}
    </button>
  );
}
