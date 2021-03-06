import { copyToClipboard } from "../../libs/";

(function () {
  const fetchTranscriptElment = () =>
    document.querySelectorAll<HTMLDivElement>(
      "ytd-transcript-renderer ytd-transcript-body-renderer>div"
    );

  const copyTranscript = (transcriptElement: NodeListOf<HTMLElement>) => {
    const transcriptBody = Array.from(transcriptElement);

    const transcripts = transcriptBody.map((el) => {
      const row = Array.from(el.querySelectorAll("div")).slice(0, 2);
      const timestamp = row[0].textContent?.trim();
      const transcript = row[1].textContent
        ?.trim()
        .replace(/(\r\n|\n|\r)/gm, "");
      return { timestamp, transcript };
    });

    let res = "";

    transcripts.forEach((t) => {
      res += [`${t.timestamp}`, `  ${t.transcript}\n`].join("\n");
    });

    copyToClipboard(res);
  };

  let transcriptElement = fetchTranscriptElment();

  if (transcriptElement.length !== 0) {
    copyTranscript(transcriptElement);
    return;
  }

  // click menu button
  Array.from(
    document.querySelectorAll<HTMLElement>(
      ".ytd-video-primary-info-renderer button"
    )
  )
    .slice(-1)[0]
    .click();

  // click open a transcript button
  const t = setInterval(() => {
    try {
      Array.from(
        document.querySelectorAll<HTMLElement>(
          "ytd-menu-popup-renderer paper-listbox ytd-menu-service-item-renderer"
        )
      )
        .slice(-1)[0]
        .click();
    } catch (e) {
      console.log("WARN: failed to click button opening a transcript");
      return;
    }
    clearInterval(t);

    const t2 = setInterval(() => {
      const transcriptElement = fetchTranscriptElment();
      if (transcriptElement.length === 0) return;
      copyTranscript(transcriptElement);
      clearInterval(t2);
    }, 100);
  }, 100);
})();
