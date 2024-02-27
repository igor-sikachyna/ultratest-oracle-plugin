import * as api from '@ultraos/ultratest/src/apis/testApi';
import { UltraTest, UltraTestAPI } from '@ultraos/ultratest/src/interfaces/test';
import * as plugins from '@ultraos/ultratest/src/plugins/plugins';
import { oracle } from '@ultraos/ultratest/src/plugins/custom/ultratest-oracle-plugin/oracle';

export default class OracleTest extends UltraTest {
    constructor() {
        super();
    }

    // handled by genesis plugin
    requiredProducers() {
        return 3;
    }

    // handled by UltraStartup plugin
    requiredUltraAdministrativeAccounts(): string[] {
        return [];
    }

    // handled by UltraStartup plugin
    requiredUltraProposerAccounts(): string[] {
        return [];
    }

    async onChainStart(ultra: UltraTestAPI) {
        ultra.addPlugins([
            plugins.genesis(),
            plugins.system(),
            plugins.ultraContracts(),
            await plugins.ultraStartup(),
            await oracle(),
        ]);
    }

    async tests(ultra: UltraTestAPI) {
        const systemAPI = new plugins.SystemAPI(ultra);
        const ultraAPI = new plugins.UltraAPI(ultra);
        function sleep(ms: number): Promise<void> {
            return new Promise((resolve) => setTimeout(resolve, ms));
        }

        return {
            'Check the exchange was registered': async () => {
                const rows = await systemAPI.getTableRows('eosio.oracle', 'eosio.oracle', 'feeddata');
                ultra.test.assert(rows.rows.length > 0, 'Exchange was not registered');
            },
        };
    }
}
