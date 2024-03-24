export const parseNameFromPath = (path: string) =>
  path
    .slice(1)
    // strip params from end
    .split("?")[0]
    // strip port from beginning
    .split(/:\d+\//)
    .slice(-1)[0];
