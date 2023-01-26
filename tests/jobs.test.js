const {getUnpaidJobs, performJobPayment} = require("../src/api/jobs/jobs.service");
const {getProfile} = require("../src/api/profile/profile.service");
const {Job} = require("../src/model");

describe('Jobs', () => {
    test('As a client I want to see all unpaid jobs for active contracts only', async () => {
        const jobs = await getUnpaidJobs(1)
        expect(jobs.length).toEqual(1)
        expect(jobs[0].Contract.ClientId).toEqual(1)
        expect(jobs[0].Contract.status).toEqual('in_progress')
    })

    test('As a contractor I want to see all unpaid jobs for active contracts only', async () => {
        const jobsZeroLength = await getUnpaidJobs(5)
        expect(jobsZeroLength.length).toEqual(0)

        const jobs = await getUnpaidJobs(6)
        expect(jobs[0].Contract.ContractorId).toEqual(6)
        expect(jobs[0].Contract.status).toEqual('in_progress')
    })

    test('As a client I want to be able to pay for the job', async () => {
        const profile = await getProfile(1)
        const oldBalance = profile.balance
        await performJobPayment(2, profile)
        const updatedProfile = await getProfile(1)
        const job = await Job.findOne({where: {id: 2}})

        expect(job.paid).toBeTruthy()
        expect(updatedProfile.balance).toEqual(oldBalance - 201)
    })

    test("As a client I don't want to be able to pay for the same job twice", async () => {
        try {
            const profile = await getProfile(1)
            await performJobPayment(2, profile)
        } catch (e) {
            expect(e.code).toEqual(422)
        }
    })

    test('As a contractor I want to get paid for my job', async () => {
        const job = await Job.findOne({where: {id: 2}})
        job.set({paid: null, paymentDate: null})
        await job.save()

        const profile = await getProfile(1)
        const contractor = await getProfile(6)
        const oldBalance = contractor.balance

        await performJobPayment(2, profile)
        const updatedContractorProfile = await getProfile(6)

        expect(updatedContractorProfile.balance).toEqual(oldBalance + 201)

    })
})
