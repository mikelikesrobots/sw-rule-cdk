import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { SiteWiseAssetModels } from './sitewise_asset_models';
import { SiteWiseAssets } from './sitewise_assets';
import { SiteWiseIotRule } from './sitewise_iot_rule';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const models = new SiteWiseAssetModels(this, "sitewise-asset-models", {});

    new SiteWiseAssets(this, "sitewise-assets", {
      robotModel: models.robotModel,
      fleetModel: models.fleetModel,
    });

    new SiteWiseIotRule(this, "sitewise-iot-rule", {});
  }
}
