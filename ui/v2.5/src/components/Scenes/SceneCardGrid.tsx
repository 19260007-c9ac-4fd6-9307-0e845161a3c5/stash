import React from "react";
import * as GQL from "src/core/generated-graphql";
import { SceneQueue } from "src/models/sceneQueue";
import { SceneCard } from "./SceneCard";
import {
  useCardWidth,
  useContainerDimensions,
} from "../Shared/GridCard/GridCard";
import { PatchComponent } from "src/patch";
import cx from "classnames";
import ScreenUtils from "src/utils/screen";

interface ISceneCardGrid {
  scenes: GQL.SlimSceneDataFragment[];
  queue?: SceneQueue;
  selectedIds: Set<string>;
  zoomIndex: number;
  onSelectChange: (id: string, selected: boolean, shiftKey: boolean) => void;
  fromGroupId?: string;
}

const zoomWidths = [280, 340, 480, 640];

export const SceneCardGrid: React.FC<ISceneCardGrid> = PatchComponent(
  "SceneCardGrid",
  ({ scenes, queue, selectedIds, zoomIndex, onSelectChange, fromGroupId }) => {
    const [componentRef, { width: containerWidth }] = useContainerDimensions();

    const cardWidth = useCardWidth(containerWidth, zoomIndex, zoomWidths);

    const isMobile = ScreenUtils.isMobile();

    return (
      <div
        className={cx("row justify-content-center", {
          "scene-card-grid-mobile": isMobile,
        })}
        ref={componentRef}
      >
        {scenes.map((scene, index) => (
          <SceneCard
            key={scene.id}
            width={isMobile ? undefined : cardWidth}
            scene={scene}
            queue={queue}
            index={index}
            zoomIndex={zoomIndex}
            selecting={selectedIds.size > 0}
            selected={selectedIds.has(scene.id)}
            onSelectedChanged={(selected: boolean, shiftKey: boolean) =>
              onSelectChange(scene.id, selected, shiftKey)
            }
            fromGroupId={fromGroupId}
          />
        ))}
      </div>
    );
  }
);
