import { PropsWithChildren, useMemo } from "react";
import LoadingSpinner from "./Ui/LoadingSpinner";

interface PageButton {
  type?: "submit" | undefined;
  form?: string;
  style?: string;
  loading?: boolean;
  onClick?(event: any): void;
}

export default function PageButton(props: PropsWithChildren<PageButton>) {
  const buttonClasses = useMemo(() => {
    const classes = [
      "caa-button",
      props.style ? `caa-button--style-${props.style}` : "",
    ];
    return classes.join(" ");
  }, [props.style]);
  return (
    <button
      type={props.type}
      form={props.form}
      className={buttonClasses}
      disabled={props.loading}
      onClick={props.onClick}
    >
      {props.loading && <LoadingSpinner />}
      {props.children}
    </button>
  );
}
