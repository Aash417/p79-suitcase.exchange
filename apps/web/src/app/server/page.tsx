import prisma from 'db/index';

async function Page() {
   const user = await prisma.test.findMany();

   console.log('user', user);
   return <div>hello world</div>;
}

export default Page;
