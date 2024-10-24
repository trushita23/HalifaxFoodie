import React from "react";
const LexChatBot = () => {
  return (
    <div style={{border: "1px solid grey", marginRight: "4px" }}>
      <iframe
        title="botLex"
        src="./lex.html"
        width={450}
        height={500}
      ></iframe>
    </div>
  );
};
export default LexChatBot;
