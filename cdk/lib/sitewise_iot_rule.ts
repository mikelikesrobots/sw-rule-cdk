import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as iot from "aws-cdk-lib/aws-iot";
import * as iam from "aws-cdk-lib/aws-iam";

export interface SiteWiseIotRuleProps {
}

export class SiteWiseIotRule extends Construct {
  public readonly iotRule: iot.CfnTopicRule;
  public readonly serviceRole: iam.Role;

  constructor(scope: Construct, id: string, props: SiteWiseIotRuleProps) {
    super(scope, id);

    this.serviceRole = new iam.Role(this, 'ingest-from-iot-service-role', {
      assumedBy: new iam.ServicePrincipal('iot.amazonaws.com'),
      inlinePolicies: {
        ingestFromIotPolicy: iam.PolicyDocument.fromJson({
          Statement: [
            {
              Effect: 'Allow',
              Action: ['iotsitewise:*'],
              Resource: '*'
            }
          ],
          Version: '2012-10-17'
        })
      }
    });

    const propVal: iot.CfnTopicRule.AssetPropertyValueProperty = {
      quality: "GOOD",
      timestamp: {
        timeInSeconds: "${timeInSeconds}",
        offsetInNanos: "${offsetInNanos}",
      },
      value: {
        doubleValue: "${battery}",
      }
    };
    const putProp: iot.CfnTopicRule.PutAssetPropertyValueEntryProperty = {
      propertyAlias: "/robots/${topic(2)}/${topic(3)}/battery",
      propertyValues: [propVal]
    };
    const swAction: iot.CfnTopicRule.IotSiteWiseActionProperty = {
      putAssetPropertyValueEntries: [putProp],
      roleArn: this.serviceRole.roleArn,
    };
    const action: iot.CfnTopicRule.ActionProperty = {
      iotSiteWise: swAction,
    };
    this.iotRule = new iot.CfnTopicRule(this, "iot-rule-topic", {
      topicRulePayload: {
        sql: `SELECT * FROM 'robots/+/+/battery'`,
        actions: [action],
      },
      ruleName: `SWIngest`,
    });
  }
}