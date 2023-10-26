import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as sitewise from "aws-cdk-lib/aws-iotsitewise";

const assets = [
  {
    fleet: "Prod001",
    description: "First production facility",
    robots: ["ProdTransport001"],
  },
  { fleet: "Test001", description: "First test lab", robots: ["TestUnit001", "TestUnit002"] },
];

export interface SiteWiseAssetsProps {
  robotModel: sitewise.CfnAssetModel,
  fleetModel: sitewise.CfnAssetModel,
}

export class SiteWiseAssets extends Construct {
  constructor(scope: Construct, id: string, props: SiteWiseAssetsProps) {
    super(scope, id);

    assets.forEach(asset => {
      const hierarchies = asset.robots.map(robot => {
        const prop: sitewise.CfnAsset.AssetPropertyProperty = {
          logicalId: "RobotAssetModelBatteryMeasurement",
          alias: `/robots/${asset.fleet}/${robot}/battery`
        };
        const childAsset = new sitewise.CfnAsset(this, `robot-${asset.fleet}-${robot}`, {
          assetModelId: props.robotModel.attrAssetModelId,
          assetName: robot,
          assetProperties: [prop],
        });
        return {
          childAssetId: childAsset.attrAssetId,
          logicalId: "FleetToRobotAssetModelHierarchy",
        };
      });

      new sitewise.CfnAsset(this, `fleet-${asset.fleet}`, {
        assetModelId: props.fleetModel.attrAssetModelId,
        assetName: asset.fleet,
        assetHierarchies: hierarchies,
      });
    });
  }
}