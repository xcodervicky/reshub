export default function ContactSection({ restaurant }) {
  const { address, phone, email, hours, map_embed, name, whatsapp, swiggy_link, zomato_link } = restaurant

  return (
    <section className="py-16 px-4 bg-gray-50" id="contact">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-2">Get in Touch</p>
          <h2 className="section-title mb-3">Find Us</h2>
          <p className="text-gray-500">We'd love to see you here</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-4">
            {address && (
              <div className="card p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-lg"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt" viewBox="0 0 16 16">
                      <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
                      <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                    </svg></span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{address}</p>
                    {map_embed && (
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 text-xs font-semibold mt-2 inline-block hover:text-primary-700"
                      >
                        Open in Google Maps →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {phone && (
              <div className="card p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-lg"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-telephone-outbound" viewBox="0 0 16 16">
                      <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877zM11 .5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V1.707l-4.146 4.147a.5.5 0 0 1-.708-.708L14.293 1H11.5a.5.5 0 0 1-.5-.5" />
                    </svg></span>
                    {/* telephone icon  */}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                    <a href={`tel:${phone}`} className="text-primary-600 font-semibold hover:text-primary-700">
                      {phone}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {email && (
              <div className="card p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-lg"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope" viewBox="0 0 16 16">
                      <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
                    </svg></span>
                    {/* email icon  */}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                    <a href={`mailto:${email}`} className="text-primary-600 font-semibold hover:text-primary-700 break-all">
                      {email}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {hours && (
              <div className="card p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-lg"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clock" viewBox="0 0 16 16">
                      <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
                      <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0" />
                    </svg></span>
                    {/* clock icon  */}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Hours</h4>
                    {hours.split('|').map((h, i) => (
                      <p key={i} className="text-gray-600 text-sm">{h.trim()}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Order Again */}
            <div className="card p-5 bg-gradient-to-br from-primary-50 to-primary-100/50 border-primary-200/50">
              <h4 className="font-semibold text-gray-900 mb-3">Order Online</h4>
              <div className="flex flex-col gap-2">
                {swiggy_link && (
                  <a href={swiggy_link} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#FC8019] text-white text-sm font-bold py-2.5 rounded-xl hover:bg-[#e5721a] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
                    </svg> Order on Swiggy
                  </a>
                  // swiggy icon
                )}
                {zomato_link && (
                  <a href={zomato_link} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#E23744] text-white text-sm font-bold py-2.5 rounded-xl hover:bg-[#cb2f3c] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
                      <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
                    </svg> Order on Zomato
                  </a>
                  // zomato icon 
                )}
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-3">
            {map_embed ? (
              <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-200 h-full min-h-[400px]">
                <iframe
                  src={map_embed}
                  width="100%"
                  height="100%"
                  style={{ minHeight: '400px', border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${name} Location`}
                />
              </div>
            ) : (
              <div className="rounded-2xl bg-gray-100 h-full min-h-[400px] flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <span className="text-4xl mb-2 block">🗺️</span>
                  <p className="text-sm">Map not available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
