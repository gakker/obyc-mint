import React from "react";

const url2 = "https://obyclabs.com/"

function Header () {

    return (
        <img
        src={`/obycmintheader.png`}
        alt="OBYC Logo"
        width={400}
        onClick={() => window.open(url2, "_blank")}
      />
    )
}

export default Header;