import { HTTP_API } from '../../../apis/http';
import * as api from '../../../apis/pluginApi';
import { Plugin, argsToParams } from '../../../interfaces/plugin';
import { UltraTest, UltraTestAPI } from '../../../interfaces/test';
import { config, keychain } from '../../../services';
import { logger } from '../../../utility';

import { SystemAPI, system } from '../../system';
import { UltraAPIv2 } from '../../ultraStartup';

// import { HTTP_API } from '@ultraos/ultratest/src/apis/http';
// import * as api from '@ultraos/ultratest/src/apis/pluginApi';
// import { Plugin, argsToParams } from '@ultraos/ultratest/src/interfaces/plugin';
// import { UltraTest, UltraTestAPI } from '@ultraos/ultratest/src/interfaces/test';
// import { config, keychain } from '@ultraos/ultratest/src/services';
// import { logger } from '@ultraos/ultratest/src/utility';

// import { SystemAPI, system } from '@ultraos/ultratest/src/plugins/system';
// import { UltraAPIv2 } from '@ultraos/ultratest/src/plugins/ultraStartup';

export class OracleAPI {
    public logger: typeof logger;
    private api: HTTP_API;

    constructor(ultra: UltraTestAPI, customNodeos: api.INodeos = undefined) {
        this.api = ultra.api;
        this.logger = ultra.logger;
        if (customNodeos) this.api = new HTTP_API(customNodeos);
    }
}

export function oracle(): Plugin {
    return {
        name: 'oracle',
        params: argsToParams(arguments[Symbol.iterator]()),
        initCallback: async (plugin: Plugin, restoredFromSnapshot: boolean, ultra: UltraTestAPI) => {
            const activeTestState = ultra.activeTestState;
            const activeTestFile = ultra.activeTestState.file;
            const ultraAPI = new UltraAPIv2(ultra);

            // Register default exchange
            await ultraAPI.transactOrThrow(
                [
                    {
                        account: 'eosio.oracle',
                        name: 'regexchange',
                        authorization: [
                            {
                                actor: 'ultra.oracle',
                                permission: 'active',
                            },
                        ],
                        data: {
                            exchange: 'ugateio',
                        },
                    },
                ],
                `Failed to create token factory`,
            );
        },
        stopCallback: async () => {},
    };
}
