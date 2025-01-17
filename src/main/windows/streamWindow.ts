import { app, BrowserWindow } from "electron";
import { isDevelopment, pageRoot, preload } from "../static";

export const createWindow = (data: {
  displayId: number;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  size: {
    width: number;
    height: number;
  };
}) => {
  const win = new BrowserWindow({
    title: "Crop & Stream",
    webPreferences: {
      preload: preload,
    },
    show: false,
    fullscreenable: false,
    resizable: false,
    frame: false,
    hasShadow: true,
    focusable: true,
  });

  win.setContentSize(data.bounds.width, data.bounds.height);
  win.center();

  if (isDevelopment) {
    win.loadURL(pageRoot + "#/stream");
    win.webContents.openDevTools();
  } else {
    win.loadFile(pageRoot, { hash: "/stream" });
  }

  win.webContents.on("did-finish-load", () => {
    win.show();
    if (app.dock) {
      app.dock.show();
    }
    win.webContents.send("cropper:capture", data);
    win.focus();
  });

  win.on("focus", () => {
    win.webContents.send("focus");
  });

  win.on("blur", () => {
    win.webContents.send("blur");
  });

  win.on("closed", () => {
    app.quit();
  });

  return win;
};
