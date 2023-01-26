const {deposit, getProfile} = require("../src/api/profile/profile.service");

describe('Deposit', () => {
    test('As a client I want to be able to deposit into my account', async () => {
        const profile = await getProfile(1)
        const oldBalance = profile.balance

        await deposit({amount: 100, profile, userId: 1})
        expect(profile.balance).toEqual(oldBalance + 100)
    })

    test('As a contractor I have no need to deposit into my account', async () => {
        const profile = await getProfile(5)
        const oldBalance = profile.balance

        try {
            await deposit({amount: 100, profile, userId: 5})
        } catch (e) {
            expect(e.code).toEqual(422)
            expect(e.message).toEqual('Only client accounts can be deposited into')
        }

        expect(profile.balance).toEqual(oldBalance)
    })

    test("As a client shouldn't be able to deposit more than 25% of current jobs price", async () => {
        const profile = await getProfile(1)
        const oldBalance = profile.balance

        try {
            await deposit({amount: 100000, profile, userId: 1})
        } catch (e) {
            expect(e.code).toEqual(422)
            expect(e.message).toContain(`Deposit amount 100000 exceeds limit`)
        }
        expect(profile.balance).toEqual(oldBalance)
    })

    test("As a client I want to be able to deposit into someone else's account", async () => {
        const profile = await getProfile(1)
        const anotherProfile = await getProfile(3)
        const oldBalance = anotherProfile.balance

        try {
            await deposit({amount: 100, profile, userId: 3})
        } catch (e) {
            expect(e.code).toEqual(403)
            expect(e.message).toContain(`You are not allowed to deposit to User 3 balance`)
        }

        expect(anotherProfile.balance).toEqual(oldBalance)
    })
})
