import { useMainStore } from "../lib/mainStore";
import { MousePointer2Icon } from "lucide-react";

export const UsersPointer = () => {
  const users = useMainStore((state) =>
    state.users.filter((user) => user.metadata.id !== state.myUserId)
  );

  return (
    <>
      {users.map((user) => (
        <div
          key={user.metadata.name}
          style={{
            position: "absolute",
            left: user.cursor.x,
            top: user.cursor.y,
            color: user.metadata.color,
          }}
        >
          <MousePointer2Icon
            key={user.metadata.name}
            style={{
              color: user.metadata.color,
            }}
          />
          <p className="text-xs">{user.metadata.name}</p>
        </div>
      ))}
    </>
  );
};
