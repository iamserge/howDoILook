Videos = new FS.Collection("videos", {
  stores: [new FS.Store.FileSystem("videos", {path: "~/uploads/videos/"})]
});