import { useEffect } from "react";
import { mainStoreActions, useMainStore } from "../lib/mainStore";
import * as fabric from "fabric";
import { Figure } from "../domain";

export const useFigureRenderer = () => {
  const figures = useMainStore((s) => s.figures);
  const renderedFigureMap = useMainStore((s) => s.renderedFigureMap);
  const canvas = useMainStore((s) => s.canvas);

  // ------------------------------
  // render figures
  // ------------------------------
  useEffect(() => {
    const initNew = ({ type, ...config }: Omit<Figure, "id">) => {
      switch (type) {
        case "Rect":
          return new fabric.Rect(config);
        case "Circle":
          return new fabric.Circle(config);
        case "Triangle":
          return new fabric.Triangle(config);
        case "Textbox":
          return new fabric.Textbox("Text", config);
        default:
          throw new Error("Unknown figure type: " + type);
      }
    };

    figures.forEach(({ id, type, ...config }) => {
      const renderedFigure = renderedFigureMap.get(id);

      if (renderedFigure) {
        renderedFigure.set(config);
        renderedFigure.set("dirty", true);
      } else {
        const newFigure = initNew({ type, ...config });
        canvas.add(newFigure);
        canvas.centerObject(newFigure);

        mainStoreActions.setRenderedFigure(id, newFigure);
      }
    });
  }, [canvas, figures, renderedFigureMap]);

  // ------------------------------
  // modified listener
  // ------------------------------
  useEffect(() => {
    const modifiedListener = (
      id: string,
      figureObject: fabric.FabricObject
    ) => {
      mainStoreActions.updateFigure(id, {
        id,
        ...figureObject.toObject(),
      });
    };

    figures.forEach(({ id }) => {
      const renderedFigure = renderedFigureMap.get(id);
      if (renderedFigure) {
        renderedFigure.on("modified", () =>
          modifiedListener(id, renderedFigure)
        );
      }
    });

    return () => {
      figures.forEach(({ id }) => {
        const renderedFigure = renderedFigureMap.get(id);
        if (renderedFigure) {
          renderedFigure.off("modified", () =>
            modifiedListener(id, renderedFigure)
          );
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [figures.length, renderedFigureMap.keys.length]);
};
