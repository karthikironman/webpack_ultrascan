import React from "react";
// import ReactFlagsSelect from "react-flags-select";
// import { useTranslation } from 'react-i18next';
import "../../css/langDrop.css";
// import { withTranslation } from 'react-i18next';
import tick from "../../assets/tick.png";
import warning from "../../assets/icon_warning.png";

function Langdrop(props) {
  function handleClick(lang) {
      console.log("from handle click", lang)
    //   lang = lang.toLowerCase();
    //   i18n.changeLanguage(lang);
  }
  // const { t, i18n } = useTranslation();
  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);
  return (
    <div className="Langdrop">
      {/* <ReactFlagsSelect
        className="menu-flags"
        onSelect={(a) => handleClick(a)}
        showSelectedLabel={true}
        customLabels={{
          US: "English",
          CN: "中国的",
          FR: "Français",
          DE: "Deutsch",
          IT: "Italiano",
          JP: "日本語",
          ES: "Espanol",
        }}
        defaultCountry="US"
        countries={["US", "CN", "FR", "DE", "ES", "IT", "JP"]}
        optionsSize={18}
      /> */}
      {true? (
        <div class="date-time">
          <span class="btn_text">{today.toLocaleDateString()}</span>
          <span class="btn_text">{props.date}</span>
        </div>
      ) : (
        <div class="date-time">
          <span class="btn_text ">Device is not connected</span>
        </div>
      )}
      <div>
        <button className={!props.device_info ? "red" : "button_status"}>
          <text class="btn_text">
            {" "}
            {props.device_info ? (
              <img className="spool_img" src={tick} />
            ) : (
              <img className="spool_img" src={warning} />
            )}
          </text>
        </button>
      </div>
    </div>
  );
}

export default Langdrop;
