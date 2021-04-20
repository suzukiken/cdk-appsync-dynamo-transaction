import * as cdk from "@aws-cdk/core";
import * as appsync from "@aws-cdk/aws-appsync";
import * as dynamodb from "@aws-cdk/aws-dynamodb";

export class CdkappsyncDynamoTransactionStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const PREFIX_NAME = id.toLowerCase().replace("stack", "")
    
    // AppSync GraphQL API

    const api = new appsync.GraphqlApi(this, "api", {
      name: PREFIX_NAME + "-api",
      logConfig: {
        fieldLogLevel: appsync.FieldLogLevel.ALL,
      },
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
        },
      },
      schema: new appsync.Schema({
        filePath: "graphql/schema.graphql",
      }),
    })
    
    // Dynamo DB Tables

    const product_table = new dynamodb.Table(this, "product_table", {
      tableName: PREFIX_NAME + "Product",
      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    })
    
    // AppSync Datasource
    
    const product_datasource = api.addDynamoDbDataSource(
      "product_datasource",
      product_table
    )

    // Resolver
    
    product_datasource.createResolver({
      typeName: "Query",
      fieldName: "listStocks",
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbScanTable(),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultList(),
    })
    
    product_datasource.createResolver({
      typeName: "Mutation",
      fieldName: "addStock",
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        "mapping_template/add_stock.vtl"
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    })

    product_datasource.createResolver({
      typeName: "Mutation",
      fieldName: "adjustPcs",
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        "mapping_template/adjust_pcs.vtl"
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    })

    product_datasource.createResolver({
      typeName: "Mutation",
      fieldName: "adjustPcsTransaction",
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        "mapping_template/adjust_pcs_transaction.vtl"
      ),
      responseMappingTemplate: appsync.MappingTemplate.fromString(
        `$util.toJson($ctx.result)`
      ),
    })
    
    // Output

    if (api.apiKey) {
      new cdk.CfnOutput(this, "apikey_output", { value: api.apiKey })
    }
    
    new cdk.CfnOutput(this, "graphql_url_output", { value: api.graphqlUrl })

  }
}
