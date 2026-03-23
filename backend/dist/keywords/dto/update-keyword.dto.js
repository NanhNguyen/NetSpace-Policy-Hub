"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateKeywordDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_keyword_dto_1 = require("./create-keyword.dto");
class UpdateKeywordDto extends (0, mapped_types_1.PartialType)(create_keyword_dto_1.CreateKeywordDto) {
}
exports.UpdateKeywordDto = UpdateKeywordDto;
//# sourceMappingURL=update-keyword.dto.js.map