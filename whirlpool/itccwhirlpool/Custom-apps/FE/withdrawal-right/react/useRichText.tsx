interface useRichTextProps {
  childrenTheme: any;
  childID: any;
}

const useRichText: StorefrontFunctionComponent<useRichTextProps> = ({
  childrenTheme,
  childID,
}) => {
  const text = (childrenTheme as any)?.find(
    (child: any) => child.props.id === childID
  );

  return text;
};

export default useRichText;
