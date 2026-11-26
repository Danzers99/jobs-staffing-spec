// Generated from schema/jobs-staffing-v1.schema.json by scripts/build-packages.mjs. Do not edit.
export default {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://heydavidmorales.com/ext/jobs/v1/schema.json",
  "title": "Jobs & Staffing v1",
  "description": "An open, modular format for AI agents to describe any kind of work, done by people, by AI agents or by either (W-2 jobs, part-time, 1099 gig and contract work, agent tasks; on-site, hybrid or remote) and to request staffing with consent. A small core every opportunity has, plus optional modules for specific kinds of work (contact center, remote setup, licensing, driving) and x- modules for anything else. Upfront costs, referral relationships and freshness are required fields, not fine print. Field names follow schema.org JobPosting where one exists. Spec: https://heydavidmorales.com/ext/jobs/v1. License: CC BY 4.0.",
  "oneOf": [
    {
      "$ref": "#/$defs/JobOpportunity"
    },
    {
      "$ref": "#/$defs/StaffingRequest"
    },
    {
      "$ref": "#/$defs/OpportunityFeed"
    }
  ],
  "$defs": {
    "JobOpportunity": {
      "type": "object",
      "description": "One opportunity of any kind, for people, AI agents or either: a W-2 job, part-time work, 1099 gig or contract work, or tasks an AI agent can take on; on-site, hybrid or remote. The core says what everyone needs to decide (pay, worker status, location, upfront costs, who benefits, freshness); modules add details for specific kinds of work.",
      "required": [
        "$type",
        "id",
        "title",
        "summary",
        "hiringOrganization",
        "employment",
        "location",
        "pay",
        "costs",
        "apply",
        "disclosures",
        "source"
      ],
      "properties": {
        "$type": {
          "const": "JobOpportunity"
        },
        "$schema": {
          "type": "string",
          "format": "uri"
        },
        "id": {
          "type": "string",
          "description": "Stable identifier, unique per publisher."
        },
        "title": {
          "type": "string"
        },
        "summary": {
          "type": "string"
        },
        "workerKinds": {
          "type": "array",
          "minItems": 1,
          "uniqueItems": true,
          "items": {
            "type": "string",
            "enum": [
              "HUMAN",
              "AI_AGENT"
            ]
          },
          "description": "Who can do the work: people, AI agents, or both. When absent, the opportunity is for people (1.0 to 1.2 data). Added in 1.3."
        },
        "hiringOrganization": {
          "$ref": "#/$defs/Organization"
        },
        "occupation": {
          "type": "object",
          "properties": {
            "onet": {
              "type": "string",
              "pattern": "^\\d{2}-\\d{4}\\.\\d{2}$",
              "description": "O*NET-SOC code, e.g. 43-4051.00 (Customer Service Representatives)."
            },
            "name": {
              "type": "string"
            }
          }
        },
        "industries": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "channels": {
          "type": "array",
          "items": {
            "type": "string",
            "enum": [
              "phone",
              "chat",
              "email",
              "social",
              "video",
              "back-office"
            ]
          },
          "description": "Contact center channels. Prefer modules.contactCenter.channels (1.2); kept for 1.0 and 1.1 data."
        },
        "employment": {
          "type": "object",
          "required": [
            "type"
          ],
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "FULL_TIME",
                "PART_TIME",
                "CONTRACTOR",
                "TEMPORARY",
                "INTERN",
                "PER_DIEM",
                "OTHER"
              ],
              "description": "schema.org employmentType values. Use CONTRACTOR for independent contractor and gig work."
            },
            "workerType": {
              "type": "string",
              "enum": [
                "EMPLOYEE",
                "INDEPENDENT_CONTRACTOR",
                "TEMP_AGENCY",
                "AGENT_OPERATOR",
                "OTHER"
              ],
              "description": "The worker's legal status. In the US, EMPLOYEE means W-2 and INDEPENDENT_CONTRACTOR means 1099. AGENT_OPERATOR (1.3) is the person or company that runs an AI agent and is engaged and paid for its work. Added in 1.1."
            },
            "engagement": {
              "type": "string",
              "enum": [
                "ON_DEMAND",
                "SCHEDULED_PART_TIME",
                "FULL_TIME",
                "FIXED_TERM",
                "PER_TASK"
              ],
              "description": "ON_DEMAND is gig-style work where the worker picks shifts or tasks when they want. Added in 1.1. PER_TASK also fits AI agent work."
            },
            "classification": {
              "type": "string",
              "description": "e.g. '1099 independent contractor' or 'W-2 employee'."
            },
            "ongoing": {
              "type": "boolean",
              "description": "True when joining gives continuing access to new work, not a single gig."
            },
            "taxForm": {
              "type": "string",
              "description": "The tax form the worker receives, e.g. 1099 or W-2. Added in 1.1."
            },
            "taxesWithheld": {
              "type": "boolean",
              "description": "Whether income tax is withheld from pay. Usually false for independent contractors, who set aside their own. Added in 1.1."
            },
            "benefitsProvided": {
              "type": "boolean",
              "description": "Whether the worker receives benefits such as health insurance or paid time off. Added in 1.1."
            },
            "workerProvidesEquipment": {
              "type": "boolean",
              "description": "Whether the worker supplies their own computer, headset, internet or workspace. Added in 1.1."
            }
          },
          "description": "How the work is engaged. For gig and contract work, say so in workerType and engagement; agents should state the worker's status plainly (for example, '1099 independent contractor, not a W-2 employee')."
        },
        "location": {
          "type": "object",
          "required": [
            "remote",
            "countries"
          ],
          "properties": {
            "remote": {
              "type": "boolean",
              "description": "True when the work can be done fully remotely."
            },
            "countries": {
              "type": "array",
              "items": {
                "type": "string",
                "pattern": "^[A-Z]{2}$"
              },
              "description": "ISO 3166-1 alpha-2 countries the worker must be in (or where the work is). An empty list means no location restriction, which is common for AI agent work."
            },
            "notes": {
              "type": "string"
            },
            "type": {
              "type": "string",
              "enum": [
                "REMOTE",
                "ONSITE",
                "HYBRID",
                "MOBILE"
              ],
              "description": "MOBILE is work done on the move, e.g. delivery or field service. Added in 1.2."
            },
            "places": {
              "type": "array",
              "description": "Where on-site or hybrid work happens. Added in 1.2.",
              "items": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string"
                  },
                  "city": {
                    "type": "string"
                  },
                  "region": {
                    "type": "string"
                  },
                  "postalCode": {
                    "type": "string"
                  },
                  "country": {
                    "type": "string",
                    "pattern": "^[A-Z]{2}$"
                  }
                }
              }
            }
          }
        },
        "pay": {
          "type": "object",
          "required": [
            "currency",
            "unit",
            "min",
            "frequency"
          ],
          "properties": {
            "currency": {
              "type": "string",
              "pattern": "^[A-Z]{3}$"
            },
            "unit": {
              "type": "string",
              "enum": [
                "HOUR",
                "DAY",
                "WEEK",
                "MONTH",
                "YEAR",
                "TASK",
                "REQUEST"
              ],
              "description": "Pay unit. REQUEST (1.3) is per call to an AI agent."
            },
            "min": {
              "type": "number",
              "minimum": 0
            },
            "max": {
              "type": "number",
              "minimum": 0
            },
            "frequency": {
              "type": "string",
              "enum": [
                "DAILY",
                "WEEKLY",
                "BIWEEKLY",
                "SEMIMONTHLY",
                "MONTHLY",
                "PER_TASK"
              ]
            },
            "firstPaymentDelayDays": {
              "type": "integer",
              "minimum": 0,
              "description": "Extra delay before the first payment, beyond the normal cycle."
            },
            "notes": {
              "type": "string"
            },
            "components": {
              "type": "array",
              "description": "Pay beyond the base rate. Added in 1.2.",
              "items": {
                "type": "object",
                "required": [
                  "type"
                ],
                "properties": {
                  "type": {
                    "type": "string",
                    "enum": [
                      "BASE",
                      "TIPS",
                      "COMMISSION",
                      "BONUS",
                      "PER_TASK",
                      "MILEAGE",
                      "SHIFT_DIFFERENTIAL",
                      "OTHER"
                    ]
                  },
                  "description": {
                    "type": "string"
                  },
                  "amount": {
                    "type": "number",
                    "minimum": 0
                  },
                  "currency": {
                    "type": "string",
                    "pattern": "^[A-Z]{3}$"
                  },
                  "unit": {
                    "type": "string",
                    "enum": [
                      "HOUR",
                      "DAY",
                      "WEEK",
                      "MONTH",
                      "YEAR",
                      "TASK",
                      "MILE",
                      "ONE_TIME"
                    ]
                  },
                  "guaranteed": {
                    "type": "boolean"
                  }
                }
              }
            },
            "settlement": {
              "type": "object",
              "description": "How payment is made. For AI agent work, payment goes to the agent's operator. Added in 1.3.",
              "properties": {
                "methods": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "enum": [
                      "BANK",
                      "CARD",
                      "PAYPAL",
                      "PAYROLL",
                      "X402",
                      "STABLECOIN",
                      "OTHER"
                    ]
                  },
                  "description": "X402 is the HTTP 402 payment protocol for agents; STABLECOIN covers assets like USDC."
                },
                "asset": {
                  "type": "string",
                  "description": "For crypto settlement, e.g. USDC."
                },
                "network": {
                  "type": "string",
                  "description": "For crypto settlement, e.g. base."
                },
                "payee": {
                  "type": "string",
                  "enum": [
                    "WORKER",
                    "AGENT_OPERATOR"
                  ],
                  "description": "Who receives payment."
                },
                "notes": {
                  "type": "string"
                }
              }
            }
          }
        },
        "schedule": {
          "type": "object",
          "required": [
            "selfScheduled"
          ],
          "properties": {
            "selfScheduled": {
              "type": "boolean",
              "description": "The worker picks their own shifts."
            },
            "minShiftMinutes": {
              "type": "integer",
              "minimum": 0
            },
            "minHoursPerWeek": {
              "type": "number",
              "minimum": 0,
              "description": "0 means no minimum."
            },
            "notes": {
              "type": "string"
            }
          }
        },
        "eligibility": {
          "type": "object",
          "required": [
            "minAge",
            "experienceRequired"
          ],
          "properties": {
            "minAge": {
              "type": "integer",
              "minimum": 0
            },
            "experienceRequired": {
              "type": "boolean"
            },
            "equipment": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "other": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          }
        },
        "training": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "paid": {
              "type": "boolean",
              "description": "The worker is paid for training or certification time."
            },
            "notes": {
              "type": "string"
            }
          }
        },
        "teaming": {
          "type": "object",
          "description": "How people and AI work together in this role. Added in 1.3.",
          "properties": {
            "aiInvolvement": {
              "type": "string",
              "enum": [
                "NONE",
                "SOME",
                "ALWAYS"
              ],
              "description": "Whether AI is part of the work: never, on some assignments, or always."
            },
            "humanRole": {
              "type": "string",
              "description": "What people do, e.g. take escalations an AI hands off."
            },
            "aiRole": {
              "type": "string",
              "description": "What AI does, e.g. drafts replies or answers simple questions."
            },
            "oversight": {
              "type": "string",
              "description": "Who reviews whose work, e.g. people review low-confidence AI answers."
            }
          }
        },
        "costs": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/Cost"
          }
        },
        "growth": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "modules": {
          "$ref": "#/$defs/Modules"
        },
        "apply": {
          "type": "object",
          "required": [
            "url"
          ],
          "properties": {
            "url": {
              "type": "string",
              "format": "uri"
            },
            "steps": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          }
        },
        "faqUrl": {
          "type": "string",
          "format": "uri"
        },
        "disclosures": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/Disclosure"
          },
          "description": "Required. An empty array means the publisher has no connection to the opportunity."
        },
        "source": {
          "$ref": "#/$defs/Source"
        }
      },
      "allOf": [
        {
          "description": "Work a person can do needs schedule and eligibility (age, experience). Agent-only work (workerKinds without HUMAN) doesn't.",
          "if": {
            "required": [
              "workerKinds"
            ],
            "properties": {
              "workerKinds": {
                "not": {
                  "contains": {
                    "const": "HUMAN"
                  }
                }
              }
            }
          },
          "else": {
            "required": [
              "schedule",
              "eligibility"
            ]
          }
        }
      ]
    },
    "StaffingRequest": {
      "type": "object",
      "description": "A business's request for workers or capacity, of any kind (people, AI agents or either), sent by an agent on the business's behalf. 'consent' records that the person approved sharing these details with the provider. Contact center specifics go in modules.contactCenter.",
      "required": [
        "$type",
        "company",
        "contact",
        "needs",
        "consent"
      ],
      "properties": {
        "$type": {
          "const": "StaffingRequest"
        },
        "$schema": {
          "type": "string",
          "format": "uri"
        },
        "company": {
          "type": "string"
        },
        "contact": {
          "type": "object",
          "required": [
            "name",
            "email"
          ],
          "properties": {
            "name": {
              "type": "string"
            },
            "email": {
              "type": "string",
              "format": "email"
            },
            "role": {
              "type": "string"
            }
          }
        },
        "needs": {
          "type": "string",
          "description": "What they need, in their words."
        },
        "channels": {
          "type": "array",
          "items": {
            "type": "string",
            "enum": [
              "phone",
              "chat",
              "email",
              "social",
              "video",
              "back-office"
            ]
          },
          "description": "Contact center channels. Prefer modules.contactCenter.channels (1.2)."
        },
        "agentsNeeded": {
          "type": "integer",
          "minimum": 1,
          "description": "Contact center agents needed. headcount is the general field (1.2)."
        },
        "weeklyContacts": {
          "type": "integer",
          "minimum": 0,
          "description": "Contact center volume per week."
        },
        "peakPeriod": {
          "type": "string"
        },
        "startBy": {
          "type": "string",
          "format": "date"
        },
        "industry": {
          "type": "string"
        },
        "platform": {
          "type": "string",
          "description": "Contact center platform (CCaaS), e.g. Genesys, Five9, NICE. Prefer modules.contactCenter.platforms (1.2)."
        },
        "usesAI": {
          "type": "boolean"
        },
        "compliance": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "e.g. HIPAA, PCI-DSS, SOC 2."
        },
        "languages": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "BCP 47 tags, e.g. en, es."
        },
        "consent": {
          "type": "object",
          "required": [
            "shareWithProvider"
          ],
          "properties": {
            "shareWithProvider": {
              "const": true,
              "description": "The person reviewed these details and asked to send them."
            },
            "at": {
              "type": "string",
              "format": "date-time"
            }
          }
        },
        "roles": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "The kinds of workers needed, e.g. customer service agents, pharmacy technicians, delivery drivers. Added in 1.2."
        },
        "headcount": {
          "type": "integer",
          "minimum": 1,
          "description": "Roughly how many workers. Added in 1.2; for contact centers, agentsNeeded is the same number."
        },
        "workerKinds": {
          "type": "array",
          "minItems": 1,
          "uniqueItems": true,
          "items": {
            "type": "string",
            "enum": [
              "HUMAN",
              "AI_AGENT"
            ]
          },
          "description": "Whether the business wants people, AI agents, or either. Added in 1.3."
        },
        "location": {
          "$ref": "#/$defs/JobOpportunity/properties/location"
        },
        "workerTypes": {
          "type": "array",
          "items": {
            "type": "string",
            "enum": [
              "EMPLOYEE",
              "INDEPENDENT_CONTRACTOR",
              "TEMP_AGENCY",
              "OTHER"
            ]
          },
          "description": "Worker arrangements the business will accept. Added in 1.2."
        },
        "modules": {
          "$ref": "#/$defs/Modules"
        }
      }
    },
    "OpportunityFeed": {
      "type": "object",
      "description": "A publisher's list of JobOpportunity objects, e.g. served at /opportunities.json.",
      "required": [
        "$type",
        "publisher",
        "updated",
        "opportunities"
      ],
      "properties": {
        "$type": {
          "const": "OpportunityFeed"
        },
        "$schema": {
          "type": "string",
          "format": "uri"
        },
        "publisher": {
          "$ref": "#/$defs/Organization"
        },
        "updated": {
          "type": "string",
          "format": "date"
        },
        "opportunities": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/JobOpportunity"
          }
        }
      }
    },
    "Modules": {
      "type": "object",
      "description": "Optional details for specific kinds of work. Use the modules that apply; add your own with an x- prefix (e.g. x-retail) or a URI key. Added in 1.2; aiAgent in 1.3.",
      "properties": {
        "contactCenter": {
          "$ref": "#/$defs/ContactCenterModule",
          "description": "Customer service, support, sales and other contact center work."
        },
        "remoteSetup": {
          "$ref": "#/$defs/RemoteSetupModule",
          "description": "Equipment, internet and workspace for remote work."
        },
        "licensing": {
          "$ref": "#/$defs/LicensingModule",
          "description": "Licenses, certifications and checks required before starting."
        },
        "driving": {
          "$ref": "#/$defs/DrivingModule",
          "description": "Delivery, rideshare, transport and other driving work."
        },
        "aiAgent": {
          "$ref": "#/$defs/AiAgentModule",
          "description": "Work done by AI agents: protocols, skills, quality bar, oversight, accountability."
        }
      },
      "patternProperties": {
        "^x-[a-z0-9][a-z0-9-]*$": {
          "type": "object"
        },
        "^https?://": {
          "type": "object"
        }
      },
      "additionalProperties": false
    },
    "ContactCenterModule": {
      "type": "object",
      "description": "For customer service, support, sales and other contact center work. Added in 1.2.",
      "properties": {
        "channels": {
          "type": "array",
          "items": {
            "type": "string",
            "enum": [
              "phone",
              "chat",
              "email",
              "social",
              "video",
              "back-office"
            ]
          },
          "description": "Channels the worker handles."
        },
        "programs": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Kinds of work, e.g. billing and claims, technical support, sales, retention."
        },
        "platforms": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Contact center software used, e.g. Genesys, Five9, NICE."
        },
        "languages": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "BCP 47 tags, e.g. en, es."
        },
        "inbound": {
          "type": "boolean"
        },
        "outbound": {
          "type": "boolean"
        }
      }
    },
    "RemoteSetupModule": {
      "type": "object",
      "description": "What a remote worker needs at home. Added in 1.2.",
      "properties": {
        "computer": {
          "type": "string",
          "description": "e.g. Windows 11 PC with 8 GB of RAM."
        },
        "headset": {
          "type": "string"
        },
        "internetMinMbps": {
          "type": "number",
          "minimum": 0
        },
        "wiredInternetRequired": {
          "type": "boolean"
        },
        "quietPrivateSpace": {
          "type": "boolean"
        },
        "other": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      }
    },
    "LicensingModule": {
      "type": "object",
      "description": "Licenses, certifications or clearances required before starting. Added in 1.2.",
      "properties": {
        "required": {
          "type": "array",
          "items": {
            "type": "object",
            "required": [
              "name"
            ],
            "properties": {
              "name": {
                "type": "string",
                "description": "e.g. Registered Nurse, Pharmacy Technician, CDL Class A."
              },
              "issuer": {
                "type": "string"
              },
              "region": {
                "type": "string",
                "description": "Where it must be valid, e.g. FL or US."
              },
              "providedByEmployer": {
                "type": "boolean",
                "description": "The employer or platform provides or pays for it."
              }
            }
          }
        },
        "backgroundCheck": {
          "type": "boolean"
        },
        "drugTest": {
          "type": "boolean"
        },
        "fingerprinting": {
          "type": "boolean"
        }
      }
    },
    "DrivingModule": {
      "type": "object",
      "description": "Delivery, rideshare, transport and other driving work. Added in 1.2.",
      "properties": {
        "vehicleRequired": {
          "type": "boolean"
        },
        "vehicleTypes": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "e.g. car, bike, scooter, box truck."
        },
        "licenseClass": {
          "type": "string"
        },
        "insuranceRequired": {
          "type": "boolean"
        },
        "mileageReimbursed": {
          "type": "boolean"
        },
        "minVehicleYear": {
          "type": "integer"
        }
      }
    },
    "AiAgentModule": {
      "type": "object",
      "description": "Work done by AI agents: what the agent must support, the quality bar, oversight and accountability. Added in 1.3.",
      "properties": {
        "protocols": {
          "type": "array",
          "items": {
            "type": "string",
            "enum": [
              "A2A",
              "MCP",
              "HTTP_API",
              "OTHER"
            ]
          },
          "description": "How the work is delivered to and from the agent."
        },
        "skills": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Capabilities the agent needs, e.g. classify support emails, draft replies, extract fields."
        },
        "inputModes": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "MIME types the agent receives."
        },
        "outputModes": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "MIME types the agent returns."
        },
        "maxResponseSeconds": {
          "type": "number",
          "minimum": 0
        },
        "qualityBar": {
          "type": "string",
          "description": "What good work means, e.g. 95% routing accuracy on a sample."
        },
        "evaluation": {
          "type": "string",
          "description": "How results are checked before and during the work."
        },
        "humanOversight": {
          "type": "boolean",
          "description": "People review some or all of the agent's work."
        },
        "operatorMustBeIdentified": {
          "type": "boolean",
          "description": "A named person or company must stand behind the agent and be accountable for it."
        },
        "dataHandling": {
          "type": "object",
          "properties": {
            "personalDataInvolved": {
              "type": "boolean"
            },
            "retentionAllowed": {
              "type": "string",
              "description": "e.g. none, or 30 days."
            },
            "compliance": {
              "type": "array",
              "items": {
                "type": "string"
              },
              "description": "e.g. HIPAA, PCI-DSS, SOC 2."
            }
          }
        }
      }
    },
    "Cost": {
      "type": "object",
      "description": "Anything the worker pays before or while starting: fees, checks, required purchases. Required in JobOpportunity.costs; an empty array means the publisher states there are none.",
      "required": [
        "name",
        "amount",
        "currency",
        "refundable"
      ],
      "properties": {
        "name": {
          "type": "string",
          "description": "e.g. Background check."
        },
        "amount": {
          "type": "number",
          "minimum": 0
        },
        "currency": {
          "type": "string",
          "pattern": "^[A-Z]{3}$"
        },
        "oneTime": {
          "type": "boolean",
          "default": true
        },
        "refundable": {
          "type": "boolean",
          "description": "Paid back to the worker by the hiring organization."
        },
        "refundCondition": {
          "type": "string",
          "description": "When it is paid back, e.g. 'once you start working' or 'after 200 production hours'."
        },
        "offsetBy": {
          "type": "object",
          "description": "A bonus or payment that covers the cost, when the cost itself is not refunded.",
          "required": [
            "name",
            "amount",
            "currency"
          ],
          "properties": {
            "name": {
              "type": "string"
            },
            "amount": {
              "type": "number",
              "minimum": 0
            },
            "currency": {
              "type": "string",
              "pattern": "^[A-Z]{3}$"
            },
            "condition": {
              "type": "string"
            }
          }
        },
        "regularAmount": {
          "type": "number",
          "minimum": 0,
          "description": "The usual amount when 'amount' is a temporary price."
        },
        "priceValidUntil": {
          "type": "string",
          "format": "date"
        },
        "appliesTo": {
          "type": "string",
          "description": "Which roles, campaigns or locations the cost applies to."
        }
      }
    },
    "Disclosure": {
      "type": "object",
      "description": "A material connection between the publisher and the opportunity (e.g. a referral link, employment, payment). Agents should show these to the people they recommend to.",
      "required": [
        "type",
        "text"
      ],
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "referral",
            "employee",
            "paid",
            "affiliate",
            "other"
          ]
        },
        "text": {
          "type": "string"
        }
      }
    },
    "Source": {
      "type": "object",
      "required": [
        "publisher",
        "updated"
      ],
      "properties": {
        "publisher": {
          "type": "string"
        },
        "url": {
          "type": "string",
          "format": "uri"
        },
        "updated": {
          "type": "string",
          "format": "date",
          "description": "When the facts were last confirmed. Agents should prefer recent data and say how old it is."
        },
        "authority": {
          "type": "string",
          "description": "Why the publisher knows, e.g. 'employee of the hiring organization'."
        }
      }
    },
    "Money": {
      "type": "object",
      "required": [
        "amount",
        "currency"
      ],
      "properties": {
        "amount": {
          "type": "number",
          "minimum": 0
        },
        "currency": {
          "type": "string",
          "pattern": "^[A-Z]{3}$",
          "description": "ISO 4217 code, e.g. USD."
        }
      }
    },
    "Organization": {
      "type": "object",
      "required": [
        "name"
      ],
      "properties": {
        "name": {
          "type": "string"
        },
        "url": {
          "type": "string",
          "format": "uri"
        }
      }
    }
  }
};
