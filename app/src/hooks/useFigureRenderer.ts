import { useEffect } from "react";
import { mainStoreActions, useMainStore } from "../lib/mainStore";
import * as fabric from "fabric";
import { Figure } from "../domain";
import { YMapEvent } from "yjs";

export const useFigureRenderer = () => {
  const yFigureIds = useMainStore((s) => s.yFigureIds);
  const yFigureConfigMap = useMainStore((s) => s.yFigureConfigMap);

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

    let unobserverConfigs: Array<() => void> = [];

    const figureIdsObserver = () => {
      unobserverConfigs.forEach((unobserver) => unobserver());
      unobserverConfigs = [];

      yFigureIds.forEach((id) => {
        const yConfig = yFigureConfigMap.get(id);

        if (yConfig) {
          const yConfigObserver = (event?: YMapEvent<unknown>) => {
            const renderedFigure = renderedFigureMap.get(id);

            if (renderedFigure) {
              event?.changes.keys.forEach((_change, key) => {
                if (key === "type") return;

                const value = yConfig.get(key);
                renderedFigure.set(key, value);
              });
              renderedFigure.set("dirty", true);
              canvas.renderAll();
            } else {
              const jsonConfig = yConfig.toJSON() as Figure;
              const newFigure = initNew(jsonConfig);

              canvas.add(newFigure);
              canvas.centerObject(newFigure);

              mainStoreActions.setRenderedFigure(id, newFigure);
            }
          };

          yConfigObserver();
          yConfig.observe(yConfigObserver);

          unobserverConfigs.push(() => {
            yConfig.unobserve(yConfigObserver);
          });
        }
      });
    };

    figureIdsObserver();
    yFigureIds.observe(figureIdsObserver);

    return () => {
      yFigureIds.unobserve(figureIdsObserver);
      unobserverConfigs.forEach((unobserver) => unobserver());
    };
  }, [canvas, yFigureConfigMap, yFigureIds, renderedFigureMap]);

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

    yFigureIds.forEach((id) => {
      const renderedFigure = renderedFigureMap.get(id);
      if (renderedFigure) {
        renderedFigure.on("modified", () =>
          modifiedListener(id, renderedFigure)
        );
      }
    });

    return () => {
      yFigureIds.forEach((id) => {
        const renderedFigure = renderedFigureMap.get(id);
        if (renderedFigure) {
          renderedFigure.off("modified", () =>
            modifiedListener(id, renderedFigure)
          );
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yFigureIds.toArray().length, renderedFigureMap.keys.length]);
};
