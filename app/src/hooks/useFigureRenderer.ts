import { useEffect } from "react";
import { mainStoreActions, useMainStore } from "../lib/mainStore";
import * as fabric from "fabric";
import { Figure } from "../domain";
import { YArrayEvent, YMapEvent } from "yjs";

export const useFigureRenderer = () => {
  const yFigureIds = useMainStore((s) => s.yFigureIds);
  const yFigureConfigMap = useMainStore((s) => s.yFigureConfigMap);

  const renderedFigureMap = useMainStore((s) => s.renderedFigureMap);
  const canvas = useMainStore((s) => s.canvas);

  // ------------------------------
  // render figures
  // ------------------------------
  useEffect(() => {
    const initNew = ({ type, ...config }: Figure) => {
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

    let removeObserverConfigs: Array<() => void> = [];

    const figureIdsObserver = (e?: YArrayEvent<string>) => {
      if (e && e.delta.length > 0) {
        const currentIds = Array.from(renderedFigureMap.keys());
        const newIds = yFigureIds.toArray();

        currentIds
          .filter((id) => !newIds.includes(id))
          .forEach((id) => {
            const figure = renderedFigureMap.get(id);
            if (figure) {
              canvas.remove(figure);
              mainStoreActions.renderedFigure.remove(id);
            }
          });
      }

      removeObserverConfigs.forEach((unobserver) => unobserver());
      removeObserverConfigs = [];

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
              canvas.requestRenderAll();
            } else {
              const jsonConfig = yConfig.toJSON() as Figure;
              const newFigure = initNew(jsonConfig);

              canvas.add(newFigure);
              mainStoreActions.renderedFigure.set(id, newFigure);
            }
          };

          yConfigObserver();
          yConfig.observe(yConfigObserver);

          removeObserverConfigs.push(() => {
            yConfig.unobserve(yConfigObserver);
          });
        }
      });
    };

    figureIdsObserver();
    yFigureIds.observe(figureIdsObserver);

    return () => {
      yFigureIds.unobserve(figureIdsObserver);
      removeObserverConfigs.forEach((unobserver) => unobserver());
    };
  }, [canvas, yFigureConfigMap, yFigureIds, renderedFigureMap]);

  // ------------------------------
  // modified figure listener
  // ------------------------------
  useEffect(() => {
    const onFigureModified = (
      id: string,
      figureObject: fabric.FabricObject
    ) => {
      mainStoreActions.figure.update(id, {
        id,
        ...figureObject.toObject(),
      });
    };

    const unsubscribeCallbacks = yFigureIds.map((id) => {
      const renderedFigure = renderedFigureMap.get(id);

      if (renderedFigure) {
        const figureModifiedCallback = () =>
          onFigureModified(id, renderedFigure);

        const figureSelectedCallback = () => {
          mainStoreActions.canvas.selectFigure({
            id,
            type: renderedFigure.type,
          });
        };

        const figureDeselectedCallback = () => {
          mainStoreActions.canvas.deselectFigure();
        };

        renderedFigure.on("modified", figureModifiedCallback);
        renderedFigure.on("moving", figureModifiedCallback);
        renderedFigure.on("selected", figureSelectedCallback);
        renderedFigure.on("deselected", figureDeselectedCallback);

        return () => {
          renderedFigure.off("modified", figureModifiedCallback);
          renderedFigure.off("moving", figureModifiedCallback);
          renderedFigure.off("selected", figureSelectedCallback);
          renderedFigure.off("deselected", figureDeselectedCallback);
        };
      }

      return () => {};
    });

    return () => {
      unsubscribeCallbacks.forEach((unsubscribe) => unsubscribe());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yFigureIds.toArray().length, renderedFigureMap.keys.length]);
};
