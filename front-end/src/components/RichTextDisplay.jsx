import DOMPurify from "dompurify";

const RichTextDisplay = ({ richText }) => {
  const sanitizedHTML = DOMPurify.sanitize(richText);
  return <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;
};

export default RichTextDisplay;
