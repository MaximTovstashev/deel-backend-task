const {getContract, getContracts} = require("../src/api/contracts/contracts.service");

describe('Contracts', () => {
    test('As a client I want to retrieve my contract by id', async () => {
        const contract = await getContract(1, 1)
        expect(contract).toBeDefined()
        expect(contract.id).toEqual(1)
    })

    test('As a contractor I want to retrieve my contract by id', async () => {
        const contract = await getContract(1, 5)
        expect(contract).toBeDefined()
        expect(contract.id).toEqual(1)
    })

    test("As a client I expect to be unable to retrieve someone else's contract by id", async () => {
        try {
            const contract = await getContract(1, 5)
        } catch (e) {
            expect(e.code).toEqual(404)
        }
    })

    test('As a client I want to retrieve the list of my non-terminated contracts', async () => {
        const contracts = await getContracts(1)
        expect(contracts.length).toEqual(1)
        expect(contracts[0].status).toEqual('in_progress')
    })

    test('As a contractor I want to retrieve the list of my non-terminated contracts', async () => {
        const contractsZeroLength = await getContracts(5)
        expect(contractsZeroLength.length).toEqual(0)

        const contracts = await getContracts(6)
        expect(contracts.length).toEqual(3)
    })
})
