import { mainStoreActions, useMainStore } from "../lib/mainStore";
import { SketchPicker } from "react-color";
import { SheetContent, Sheet } from "./base/Sheet";
import { useEffect, useState } from "react";

const captions = {
  backgroundColor: "Background Color",
};

export const FigureSetting = () => {
  const selectedFigure = useMainStore((s) => s.selectedFigure);
  const canvas = useMainStore((s) => s.canvas);

  const [color, setColor] = useState("#fff");

  useEffect(() => {
    if (selectedFigure) {
      const activeObject = canvas.getActiveObject();
      const currColor = activeObject?.fill as string | undefined;
      setColor(currColor || "#fff");
    }
  }, [canvas, selectedFigure]);

  return (
    <Sheet open={!!selectedFigure} modal={false}>
      <SheetContent noOverlay className="w-68">
        <p className="text-sm font-semibold mb-2">{captions.backgroundColor}</p>
        <SketchPicker
          color={color}
          styles={{
            default: {
              picker: { boxShadow: "none", padding: 0 },
            },
          }}
          onChange={(color) => {
            setColor(color.hex);
          }}
          onChangeComplete={(color) => {
            if (selectedFigure) {
              const activeObject = canvas.getActiveObject();

              if (activeObject) {
                activeObject?.set("fill", color.hex);
                mainStoreActions.figure.update(
                  selectedFigure.id,
                  activeObject.toObject()
                );
              }
            }
          }}
        />
      </SheetContent>
    </Sheet>
  );
};
