const queue = {
  status: "PENDING",
  comic: {},
  chapter: {},
  jobs: [
    {
      status: "PENDING",
      type: "DOWNLOAD",
      url: "https://cdn.mangaeden.com/1.png",
      file: "{tmp dir}/grabbix/{job number}/{page number}.{extension from web}"
    },
    {
      status: "PENDING",
      type: "COMPRESS",
      x: "CBZ"
    }
  ]
};

// 0. PENDING
// 1. PROCESSING
// 2. COMPLETED or FAILED
