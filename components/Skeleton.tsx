function Skeleton() {
  return (
    <>
      <div className="mt-10 flex w-full flex-1 flex-col items-center">
        <Box />
        <Box />
        <Box />
        <Box />
      </div>
    </>
  );
}

function Box() {
  return (
    <div className="mb-5 w-full flex-row items-center justify-center space-x-1 rounded-xl border p-6 bg-gray-100 ">
      <div className="flex animate-pulse flex-col space-y-2">
        <div className="h-6 w-11/12 rounded-md bg-gray-300 "></div>
        <div className="h-6 w-10/12 rounded-md bg-gray-300 "></div>
        <div className="h-6 w-9/12 rounded-md bg-gray-300 "></div>
        <div className="h-6 w-9/12 rounded-md bg-gray-300 "></div>
      </div>
    </div>
  )
}

export default Skeleton
