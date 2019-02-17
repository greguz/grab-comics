const queue = {
  comic: {},
  chapter: {},
  jobs: [
    {
      type: "DOWNLOAD",
      status: "PENDING",
      url: "https://cdn.mangaeden.com/1.png",
      file: "{tmp dir}/grabbix/{job number}/{page number}.{extension from web}"
    },
    {
      type: "COMPRESS",
      status: "PENDING",
      x: "CBZ"
    }
  ]
};

// 0. PENDING
// 1. PROCESSING
// 2. COMPLETED or FAILED
