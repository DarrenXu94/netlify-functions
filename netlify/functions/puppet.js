const chromium = require("@sparticuz/chromium");
// const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");
const puppeteerExtra = require("puppeteer-extra");

const handleConsoleMsg = async (msg) => {
  try {
    for (const arg of msg.args()) {
      const parsed = await arg.jsonValue();
      if (typeof parsed == "object" && "data" in parsed) {
        return parsed.data;
      }
    }
  } catch (e) {
    console.log(e);
    return;
  }
};

exports.handler = async (event, context, callback) => {
  let theTitle = null;
  let browser = null;
  console.log("spawning chrome headless");
  try {
    const executablePath = await chromium.executablePath;
    console.log(executablePath);
    // setup
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: executablePath,
      channel: "chrome",
      defaultViewport: {
        width: 1920,
        height: 1080,
      },
      headless: chromium.headless,

      // headless: false,
    });

    // Do stuff with headless chrome
    const page = await browser.newPage();
    const targetUrl = "https://cf-futsal.dribl.com/ladders/";
    await page.on("console", async (msg) => {
      const res = await handleConsoleMsg(msg);
      console.log(res);
      if (res) {
        return callback(null, {
          statusCode: 200,
          body: JSON.stringify({
            message: res,
          }),
        });
      }
    });

    // Goto page and then do stuff
    await page.goto(targetUrl, {
      waitUntil: ["domcontentloaded", "networkidle0"],
    });

    await page.waitForSelector("#__nuxt");
    await page.waitForTimeout(2000);

    await page.waitForSelector(
      "#__layout > div > div.nuxt-container.position-relative > section.section.page-filter > div > div.pageFilter.d-none.d-lg-flex.flex-wrap > div:nth-child(2)"
    );

    await page.click(
      "#__layout > div > div.nuxt-container.position-relative > section.section.page-filter > div > div.pageFilter.d-none.d-lg-flex.flex-wrap > div:nth-child(2)"
    );
    await page.waitForTimeout(1000);

    await page.click(
      "#__layout > div > div.nuxt-container.position-relative > section.section.page-filter > div > div.pageFilter.d-none.d-lg-flex.flex-wrap > div:nth-child(2) > div.filter-dropdown.shadow.w-100.d-block.position-absolute.top-100.ps.ps--active-x.ps--active-y > ul > li:nth-child(3)"
    );

    // theTitle = await page.title();

    // console.log("done on page", theTitle);
  } catch (error) {
    console.log("error", error);
    return callback(null, {
      statusCode: 500,
      body: JSON.stringify({
        error: error,
      }),
    });
  } finally {
    // close browser
    if (browser !== null) {
      await browser.close();
    }
  }

  return callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      title: theTitle,
    }),
  });
};
