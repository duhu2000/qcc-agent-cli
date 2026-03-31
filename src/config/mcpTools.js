/**
 * MCP 服务工具定义
 * 从企查查 MCP 服务获取的工具列表
 */
module.exports = {
  qcc_company: {
    name: '企业基础信息',
    description: '提供企业工商信息、股东信息、主要人员等基础信息查询',
    tools: [
      {
        name: 'get_annual_reports',
        description: '查询企业年度报告信息,包括报告年度、统一社会信用代码、注册号、企业经营状态、从业人数、股东股权转让情况、投资信息等。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_branches',
        description: '查询企业的分支机构信息,包括分支机构名称、负责人、地区、成立日期、登记状态。适用于了解企业组织架构的场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_change_records',
        description: '用于查询企业的历史变更记录,包括变更事项、变更前后内容、变更日期等企业发展变化信息。适用于企业股权变更跟踪、经营范围调整了解、重要事项变更历史查询等场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_company_profile',
        description: '查询企业的简介信息,包括企业名称、简介。适用于企业画像构建、企业业务分析场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_company_registration_info',
        description: '查询企业的核心登记信息,当用户需要验证企业身份、了解基本概况(如法定代表人、注册资本、成立时间等)时调用。可提供企业名称、统一社会信用代码、法定代表人、注册资本、成立日期、登记状态、注册地址等关键工商登记信息,支持通过企业名称或统一社会信用代码精确查询。适用于深入了解企业工商背景的场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_contact_info',
        description: '查询企业的联系方式信息,包括电话号码、用途标签、电话来源、邮箱、邮箱来源、企业网站、是否是官网、ICP备案。适用于拓客、获取企业联系方式的场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_external_investments',
        description: '查询企业对外投资信息,包括被投资企业名称、状态、成立日期、持股比例、认缴出资额/持股数。适用于分析企业投资布局的场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_key_personnel',
        description: '用于查询企业主要管理人员信息,包括姓名、职务等高管构成情况。适用于企业管理团队了解、核心人员识别、公司治理结构分析等场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_listing_info',
        description: '查询企业的上市信息,包括上市日期、股票简称、股票代码、上市交易所、总市值、总股本、发行日期、发行量。适用于投资分析场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_shareholder_info',
        description: '用于查询企业股东构成信息,包括投资人姓名、持股比例、认缴出资额、出资时间等股权结构情况。适用于企业股权结构分析、实际控制人识别、股东背景调查等场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_tax_invoice_info',
        description: '查询企业的税号开票信息,包括纳税人识别号、企业名称、企业类型、地址、联系电话、开户行、开户行账号。适用于财务开票场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'verify_company_accuracy',
        description: '用于核实企业名称、法定代表人与统一社会信用代码的匹配性。适用于企业实名认证、准入资质初审及基础信息准确性校验场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '统一社会信用代码'
            },
            name: {
              type: 'string',
              description: '企业名称或法定代表人名称'
            }
          },
          required: ['searchKey', 'name']
        }
      }
    ]
  },

  qcc_ipr: {
    name: '企业知识产权',
    description: '提供企业商标、专利、著作权等知识产权查询',
    tools: [
      {
        name: 'get_copyright_work_info',
        description: '查询企业作品著作权信息。适用于文创资产价值评估、版权保护现状分析及内容产业背调场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_internet_service_info',
        description: '查询企业的网站ICP备案、APP备案、小程序备案、算法备案信息,包括名称、备案号、许可证号、审核日期。适用于软件资产分析、网络服务分析场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_patent_info',
        description: '查询企业专利信息。适用于企业技术创新能力评估、核心技术储备分析及行业技术壁垒研究场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_software_copyright_info',
        description: '查询企业的软件著作权信息,包括软件名称、软件简称、登记号、版本号、登记日期、开发完成日期、首次发布日期、权利取得方式。适用于知识产权保护场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_standard_info',
        description: '查询企业参与制定的各类标准。适用于评估企业行业影响力、技术领先地位及标准化合规核查场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_trademark_info',
        description: '查询企业商标注册信息。适用于企业品牌资产评估、知识产权布局分析及商标侵权风险核查场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      }
    ]
  },

  qcc_operation: {
    name: '企业经营信息',
    description: '提供企业经营异常、行政处罚、税务评级等经营信息查询',
    tools: [
      {
        name: 'get_administrative_license',
        description: '查询企业行政许可信息。适用于企业合法经营资质核查、业务准入资格审查及合规性分析场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_bidding_info',
        description: '用于查询企业参与的招投标项目信息,包括项目名称、中标情况、项目金额、招标单位等市场活动信息。适用于企业业务拓展情况分析、市场份额评估、竞争对手中标情况了解等场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_company_announcement',
        description: '查询企业发布的各类公告。适用于追踪上市企业重大动态、披露信息核查及企业信息透明度评估场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_credit_evaluation',
        description: '查询企业由政府监管机构出具的官方信用评级,包括国家税务总局的纳税信用等级及海关总署的海关信用等级(高级认证/一般认证等),含评价年度和评价单位。适用于企业税务合规性核查、海关资质评估、供应商信用背调及政府采购资格审查场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_financing_records',
        description: '查询企业融资信息,包括创投融资、上市融资、增发融资。适用于追踪企业成长轨迹、投融资历史分析及市场认可度评估场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_honor_info',
        description: '查询企业获得的荣誉信息,包括名称、荣誉类型、级别、认证年份、发布日期、发布单位。适用于企业声誉评估场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_import_export_credit',
        description: '查询企业进出口信用信息,包括统一社会信用代码、所在地海关、行政区划、地址、经济区划、经营类别、统计经济区划、行业种类、跨境贸易电子商务类型、信用等级、备案日期。适用于国际贸易合作评估场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_news_sentiment',
        description: '用于查询企业相关的新闻报道和舆情信息,包括新闻标题、发布时间和情感倾向时使用。适用于企业声誉监控、品牌形象分析、危机公关预警、媒体关注度评估、企业重大事项跟踪场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_qualifications',
        description: '用于查询企业获得的各类资质证书信息,包括证书类型、等级、有效期、发证机构、证书状态等资质情况时使用。适用于企业专业能力评估、行业准入资格确认、资质有效性检查等场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_ranking_list_info',
        description: '查询企业上榜的各类榜单信息,包括榜单名称、榜内排名、来源、榜单类型、榜内名称、发布日期。适用于资本运作分析场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_recruitment_info',
        description: '查询企业招聘信息,包括发布日期、招聘职位、月薪、学历、经验、办公地点 。适用于企业人才需求分析场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_spot_check_info',
        description: '查询企业抽查检查记录,包括检查实施机关、类型、日期、结果。适用于经营资质核查场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_telecom_license',
        description: '查询企业电信业务经营许可信息,包括许可证号、业务分类、业务种类、覆盖范围、是否有效。适用于企业合规性评估场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      }
    ]
  },

  qcc_risk: {
    name: '企业风险信息',
    description: '提供企业司法案件、被执行人、失信人等风险信息查询',
    tools: [
      {
        name: 'get_administrative_penalty',
        description: '用于查询企业受到的行政处罚记录，包括处罚结果、处罚金额、处罚机关等监管处罚信息。适用于企业合规经营情况评估、违规成本分析、行政处罚历史查询等场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_bankruptcy_reorganization',
        description: '用于查询企业破产重整相关信息，包括案号、申请人、被申请人、公开日期等破产程序信息。适用于企业破产风险识别、重整程序跟踪、债权人申请情况了解等场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_business_exception',
        description: '用于查询企业是否被列入经营异常名录，包括列入日期、移出原因和决定机关。适用于企业正常经营状态判断、轻微违规情况了解、企业信用修复跟踪等场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_cancellation_record_info',
        description: '用于查询企业注销备案情况，包括注销原因、注销日期、公告状态等企业终止经营信息。适用于企业存续状态确认、注销程序了解、经营主体资格查询等场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_case_filing_info',
        description: '用于查询企业涉及的法院立案信息，包括案号、案由、立案日期、原被告双方等案件基本信息。适用于企业诉讼情况初步了解、法律纠纷数量统计、案件类型分布分析等场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_chattel_mortgage_info',
        description: '查询企业动产抵押信息，包括登记编号、抵押人、抵押权人、债务人履行债务的期限、被担保主债权数额、状态、登记日期。适用于动产融资评估场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_court_notice',
        description: '用于查询企业涉及的法院公告信息，包括公告类型、案由、原告被告信息、刊登日期等司法公告内容。适用于企业法律事务公告查询、诉讼当事人信息了解、司法程序进展跟踪等场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_default_info',
        description: '查询企业债券违约、票据违约、非标资产违约信息，包括债券简称、债券类型、违约状态、首次违约日期、累计违约本金、累计违约利息、到期日期。适用于债券投资风险分析场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_disciplinary_list',
        description: '查询企业惩戒名单信息，包括类型、惩戒名单领域、列入原因、列入机关、列入日期。适用于信用评估场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_dishonest_info',
        description: '用于查询企业是否存在失信信息，包括失信被执行人名称、涉案金额、执行法院、立案日期、发布日期。适用于企业信用评估、法律风险分析、欠款违约情况调查等场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_environmental_penalty',
        description: '用于查询企业受到的环保行政处罚，包括处罚决定书文号、处罚日期、处罚单位、处罚金额等环境违法信息。适用于企业环保合规情况评估、环境风险控制、绿色经营能力判断等场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_equity_freeze',
        description: '用于查询企业股权被司法冻结的情况，包括被冻结股权数额、冻结期限、执行法院等股权受限信息。适用于股东权益风险评估、股权变更限制了解、司法保全措施查询等场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_equity_pledge_info',
        description: '用于查询企业股权出质情况，包括出质人、质权人、出质股权数额、登记日期、出质状态等股权融资信息。适用于企业融资状况分析、股权风险评估、股东资金需求判断等场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_exit_restriction',
        description: '查询企业相关人员被法院限制出境的情况。适用于高管个人风险排查、重大案件执行跟踪及司法强制措施预警场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_guarantee_info',
        description: '查询企业担保信息，包括担保方、被担保方、担保方式、担保金额、履行状态、公告日期。适用于评估企业担保风险场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_hearing_notice',
        description: '用于查询企业作为当事人的开庭公告信息，包括案号、案由、开庭时间、当事人身份等庭审排期信息。适用于企业诉讼动态跟踪、庭审时间安排查询、法律纠纷进展了解等场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_high_consumption_restriction',
        description: '用于查询企业是否存在被法院限制高消费的情况，包括涉案金额、申请人、立案日期等执行信息。适用于信用风险评估、合作伙伴风险排查、法律风险预警等场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_judgment_debtor_info',
        description: '用于查询企业作为被执行人的案件信息，包括执行标的、立案时间、执行法院等执行程序信息。适用于企业债务执行情况了解、强制执行风险判断、执行金额规模评估等场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_judicial_auction',
        description: '用于查询企业资产被司法拍卖的信息，包括拍卖标题、起拍价、评估价、拍卖时间、处置单位等资产处置情况。适用于企业资产被执行处置了解、司法变现情况跟踪、债权人受偿可能性评估等场景。适用于资产处置分析场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_judicial_documents',
        description: '用于查询企业涉及的法院判决文书，包括案件案由、裁判结果、涉案金额、当事人信息等司法判决信息。适用于企业法律纠纷历史分析、诉讼风险评估、判决结果查询等场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_land_mortgage_info',
        description: '查询企业土地抵押信息，包括土地坐落、抵押人、抵押权人、抵押起止日期、抵押面积、抵押金额、抵押土地用途。适用于土地资产抵押分析场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_liquidation_info',
        description: '查询企业清算信息，包括清算组负责人、清算组成员。适用于企业破产或解散清算分析场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_pre_litigation_mediation',
        description: '查询企业诉前调解记录，包括案号、案由、当事人、法院、立案日期。适用于纠纷解决跟踪场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_public_exhortation',
        description: '查询企业公示催告信息，包括票据号、申请人、持票人、票面金额、票据类型、发布机关、公告日期。适用于票据遗失等法律程序查询场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_serious_violation',
        description: '查询企业是否被列入严重违法失信名单。适用于企业准入严选、重大合规性审查及最高等级信用风险评估场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_service_announcement',
        description: '查询企业涉及的劳动仲裁开庭公告和送达公告，包括仲裁案号、申请人、被申请人及公告发布日期。适用于企业劳动纠纷监控、劳动仲裁程序跟踪及用工风险排查场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_service_notice',
        description: '查询企业相关送达公告，包括案号、案由、当事人、法院、发布日期。适用于法律文书送达情况场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_simple_cancellation_info',
        description: '用于查询企业简易注销相关信息，包括公告期、注销结果、登记机关等简化注销程序情况。适用于企业注销程序了解、简易注销适用情况确认、市场主体退出机制跟踪等场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_stock_pledge_info',
        description: '查询企业股权质押信息，包括质押人、质押人参股企业、质押权人、质押股份总数、质押股份市值、状态、公告日期。适用于股票质押风险分析场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_tax_abnormal',
        description: '查询企业税务非正常户记录。适用于企业税务合规性扫描、税务黑名单核查及合作伙伴财务风险预警场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_tax_arrears_notice',
        description: '用于查询企业欠税情况，包括欠税税种、欠税余额、当前新发生的欠税金额、发布单位和发布日期等税务欠款信息。适用于企业纳税信用评估、税务风险判断、欠税情况跟踪等场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_tax_violation',
        description: '用于查询企业税收违法信息，包括案件性质、主要违法事实、所属税务机关、发布日期等税务违法情况。适用于企业纳税信用评估、税务合规风险识别、税收违法行为类型分析等场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_terminated_cases',
        description: '用于查询企业涉及的终结本次执行程序案件信息，包括终本日期、执行标的、未履行金额等执行终结情况。适用于企业执行风险了解、债务清偿能力评估、终本案件统计分析等场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      },
      {
        name: 'get_valuation_inquiry',
        description: '查询企业资产询价评估信息，包括案号、标的物、所有人、当事人、确定参考价方式、询价结果、法院、原文。适用于资产评估场景。',
        inputSchema: {
          type: 'object',
          properties: {
            searchKey: {
              type: 'string',
              description: '企业名称或统一社会信用代码'
            }
          },
          required: ['searchKey']
        }
      }
    ]
  }
};