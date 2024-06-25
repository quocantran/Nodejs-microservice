"use strict";

import Template from "../models/template.model";
import { htmlTemplateEmail } from "../utils";

export default class TemplateService {
  static getTemplate = async ({ templateName = "" }) => {
    const template = await Template.findOne({
      template_name: templateName,
    }).lean();
    return template;
  };

  static newTemplate = async ({ templateName = "", templateContent = "" }) => {
    const newTemplate = await Template.create({
      template_name: templateName,
      template_content: htmlTemplateEmail(),
    });
    return newTemplate;
  };
}
