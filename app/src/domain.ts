export type User = {
  metadata: { id: string; name: string; color: string };
  cursor: {
    x: number;
    y: number;
  };
};

export type Figure = {
  id: string;
  type: string;
};
