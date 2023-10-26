import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as sitewise from "aws-cdk-lib/aws-iotsitewise";

export interface SiteWiseAssetModelsProps {

}

export class SiteWiseAssetModels extends Construct {
  public readonly robotModel: sitewise.CfnAssetModel;
  public readonly fleetModel: sitewise.CfnAssetModel;

  constructor(scope: Construct, id: string, props: SiteWiseAssetModelsProps) {
    super(scope, id);

    this.robotModel = new sitewise.CfnAssetModel(this, "sitewise-robot", {
      assetModelName: `Robot-cdk`,
      assetModelDescription:
        "Example robot with a battery percentage",
      assetModelProperties: [
        {
          name: "Battery Percentage",
          dataType: "DOUBLE",
          logicalId: "RobotAssetModelBatteryMeasurement",
          unit: "%",
          type: {
            typeName: "Measurement",
          },
        },
      ],
    });
    this.fleetModel = new sitewise.CfnAssetModel(this, "sitewise-fleet", {
      assetModelName: `Fleet-cdk`,
      assetModelDescription: "Example fleet used for organizing robots",
      assetModelHierarchies: [
        {
          childAssetModelId: this.robotModel.attrAssetModelId,
          logicalId: "FleetToRobotAssetModelHierarchy",
          name: this.robotModel.assetModelName,
        },
      ],
    });
  }
}