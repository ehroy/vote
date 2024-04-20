const fetch = require("node-fetch");
var randomize = require("randomatic");
const inquirer = require("inquirer");
const sleep = require("delay");
const curl = ({ endpoint, data, header }) =>
  new Promise((resolve, reject) => {
    let fetchData = {
      headers: header,
    };
    // console.log(fetchData);
    if (data) {
      fetchData.method = "POST";
      fetchData.body = data;
    } else {
      fetchData.method = "GET";
    }
    fetch(endpoint, fetchData)
      .then((res) => res)
      .then(async (res) => {
        if (await res.headers.raw()["set-cookie"]) {
          var data = {
            cookie: cookieHelpers(await res.headers.raw()["set-cookie"]),
            respon: await res.text(),
            status: await res.status,
          };
        } else {
          var data = {
            cookie: await res.headers.raw(),
            respon: await res.text(),
            status: await res.status,
          };
        }
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
const cookieHelpers = (arrayCookie) => {
  let newCookie = "";
  for (let index = 0; index < arrayCookie.length; index++) {
    const element = arrayCookie[index];
    if (index < arrayCookie.length - 1) {
      newCookie += element.split(";")[0] + "; ";
    } else {
      newCookie += element.split(";")[0];
    }
  }
  return newCookie;
};
function headers(cookie) {
  if (!cookie) {
    return {
      "X-Forwarded-For": `${""}${randomize("0", 3)}${"."}${randomize(
        "0",
        3
      )}${"."}${randomize("0", 3)}${"."}${randomize("0", 3)}${""}`,
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-language": "en-US,en;q=0.9",
      "sec-ch-ua":
        '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "none",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    };
  } else {
    return {
      "X-Forwarded-For": `${""}${randomize("0", 3)}${"."}${randomize(
        "0",
        3
      )}${"."}${randomize("0", 3)}${"."}${randomize("0", 3)}${""}`,
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-language": "en-US,en;q=0.9",
      "sec-ch-ua":
        '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "none",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      cookie: cookie,
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    };
  }
}
(async () => {
  let question = await inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "link vote ? ",
      },
    ])
    .then((answers) => {
      return answers.name;
    });
  let peserta = await inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "nomer ururt peserta vote ? ",
      },
    ])
    .then((answers) => {
      return answers.name;
    });
  let delayseting = await inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "set delay ( 1000 = 1 sec ) ? ",
      },
    ])
    .then((answers) => {
      return answers.name;
    });
  while (true) {
    try {
      console.log("try get cookie website...");
      const getcookie = await curl({
        endpoint: question,
        data: null,
        header: headers(),
      });

      const vote = await curl({
        endpoint: "https://pollingkita.com/ajax.php",
        data: new URLSearchParams({
          selectvoteid: peserta,
          pollid: getcookie.respon
            .split("pollid: '")[1]
            .split("', action:'get_comment'")[0],
        }),
        header: headers(getcookie.cookie),
      });
      console.log("start vote nomer urut ", peserta);
      const cekstatus = JSON.parse(vote.respon);
      //   console.log(cekstatus);
      if (cekstatus.success === true) {
        console.log(`status respon => ${cekstatus.message}`);
        console.log(cekstatus.result);
      } else {
        console.log(`status respon => ${cekstatus.message}`);
        console.log(cekstatus.result);
      }
    } catch (error) {
      console.log(error);
    }
    console.log("");
    await sleep(parseInt(delayseting));
  }
})();
