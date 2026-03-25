import React from "react";

type StaticContentPageProps = {
  pageTitle: string;
  blocks: string[];
};

const StaticContentPage = ({ pageTitle, blocks }: StaticContentPageProps) => {
  return (
    <section className="privacypage">
      <div className="main-header">
        <div className="container pravcypolicycontainer">
          <div className="row">
            <div className="col-md-12">
              <h1>{pageTitle}</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="comnpages">
        <div className="container pravcypolicycontainer">
          <div className="row">
            <div className="col-md-12">
              {blocks.map((block, index) => (
                <div
                  key={`${pageTitle}-${index}`}
                  dangerouslySetInnerHTML={{ __html: block }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StaticContentPage;
