export default function OrderCompleteStep() {
  return (
    <>
      <div className="w-full lg:w-2/3">
        <div className="flex justify-between items-end border-b border-gray-200 pb-4 mb-6">
          <h2 className="text-xl font-semibold">Your Order</h2>
          <div className="flex items-center gap-4 text-sm font-medium">
             <span>Subtotal</span>
             <span>TOTAL</span>
          </div>
        </div>

        <div className="space-y-6 text-sm">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">Couples' Pottery Workshop - Air Dry Clay</h3>
              <p className="text-gray-500 mt-1">| 2x AED 450</p>
            </div>
            <p className="font-medium">AED 900</p>
          </div>
          
          {/* ... mapping over remaining completed items ... */}

          <div className="flex justify-between items-center py-4 border-t border-gray-200 mt-8">
             <span className="bg-[#ece9e2] text-[#113224] px-4 py-1 text-xs font-semibold tracking-wider rounded">Paid</span>
             <span className="font-medium text-lg">AED 2250</span>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/3 bg-[#ece9e2] p-8 rounded-sm sticky top-8 text-sm">
        <h3 className="font-semibold mb-6">Shipping</h3>
        <p className="mb-8 text-gray-700">New York, US<br/>Same-Day Dispatching</p>
        
        <h3 className="font-semibold mb-6">Shipping Options</h3>
        <p className="mb-8 text-gray-700">Email Money Transfer<br/>Interac</p>

        <div className="space-y-4 mb-6 border-b border-gray-300 pb-6">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>AED 2958</span>
          </div>
          <div className="flex justify-between">
            <span>Discount</span>
            <span>AED 0.00</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping Costs</span>
            <span>AED 0.00</span>
          </div>
        </div>

        <div className="flex justify-between font-bold text-base mb-8">
            <span>TOTAL</span>
            <span>AED 2958</span>
        </div>

        <p className="text-center text-gray-600 mb-4">New Order, Click button bellow</p>
        <button className="w-full border border-[#113224] text-[#113224] py-4 font-medium hover:bg-[#113224] hover:text-white transition-colors">
          Shop Now
        </button>
      </div>
    </>
  );
}