export function GetFullDate(dates) {
  const date = new Date(dates);
  const months = new Array(
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des"
  );
  let dd = String(date.getDate()).padStart(2, "0");
  let yyyy = date.getFullYear();
  let month = months[date.getMonth()];
  return dd + " " + month + " " + yyyy;
}

export function formatAMPM(dates) {
  let date = new Date(dates);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}
export function formatDateYYYYMMDD(dates) {
  let date = new Date(dates);
  let dd = String(date.getDate()).padStart(2, "0");
  let mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
  let yyyy = date.getFullYear();
  const setToday = yyyy + "-" + mm + "-" + dd;
  return setToday;
}
export const getDateNow = () => {
  let date = new Date();
  let dd = String(date.getDate()).padStart(2, "0");
  let mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
  let yyyy = date.getFullYear();
  const setToday = yyyy + "-" + mm + "-" + dd;
  return setToday;
};
export const getDateTimeNow = () => {
  let date = new Date();
  let dd = String(date.getDate()).padStart(2, "0");
  let mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
  let yyyy = date.getFullYear();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  const setToday =
    yyyy + "-" + mm + "-" + dd + " " + hours + ":" + minutes + ":" + seconds;
  return setToday;
};
