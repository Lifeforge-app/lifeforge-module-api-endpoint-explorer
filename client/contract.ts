export const contract = {
  "list": {
    "method": "get",
    "description": "List all registered routes",
    "noAuth": false,
    "encrypted": true,
    "isDownloadable": false,
    "media": null,
    "input": {},
    "output": {
      "OK": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "additionalProperties": {
          "type": "object",
          "properties": {
            "displayName": {
              "type": "string"
            },
            "icon": {
              "type": "string"
            },
            "category": {
              "type": "string"
            },
            "routes": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "method": {
                    "type": "string"
                  },
                  "path": {
                    "type": "string"
                  },
                  "description": {
                    "type": "string"
                  },
                  "noAuth": {
                    "type": "boolean"
                  },
                  "encrypted": {
                    "type": "boolean"
                  },
                  "isDownloadable": {
                    "type": "boolean"
                  },
                  "media": {
                    "anyOf": [
                      {
                        "type": "object",
                        "additionalProperties": {
                          "type": "object",
                          "properties": {
                            "optional": {
                              "type": "boolean"
                            },
                            "multiple": {
                              "type": "boolean"
                            }
                          },
                          "required": [
                            "optional"
                          ],
                          "additionalProperties": false
                        }
                      },
                      {
                        "type": "null"
                      }
                    ]
                  },
                  "input": {
                    "type": "object",
                    "properties": {
                      "query": {
                        "type": "object",
                        "additionalProperties": {}
                      },
                      "body": {
                        "type": "object",
                        "additionalProperties": {}
                      }
                    },
                    "additionalProperties": false
                  },
                  "output": {
                    "anyOf": [
                      {
                        "type": "string",
                        "const": "custom"
                      },
                      {
                        "type": "object",
                        "additionalProperties": {}
                      }
                    ]
                  }
                },
                "required": [
                  "method",
                  "path",
                  "description",
                  "noAuth",
                  "encrypted",
                  "isDownloadable",
                  "media",
                  "input",
                  "output"
                ],
                "additionalProperties": false
              }
            }
          },
          "required": [
            "displayName",
            "icon",
            "category",
            "routes"
          ],
          "additionalProperties": false
        }
      }
    }
  }
} as const

export default contract
