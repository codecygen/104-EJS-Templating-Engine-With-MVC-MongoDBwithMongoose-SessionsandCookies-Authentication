const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    blogTitle: {
      type: String,
      required: true,
    },

    blogContent: {
      type: String,
      required: true,
    },
  },
  { collection: "BlogTable" }
);

blogSchema.statics.autoAddBlogs = async function () {
  const blogData = [
    {
      blogTitle: "Lorem Ipsum Title",
      blogContent: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ac turpis egestas sed tempus urna et pharetra. Amet consectetur adipiscing elit pellentesque habitant morbi tristique senectus. Ut morbi tincidunt augue interdum. Bibendum ut tristique et egestas quis ipsum. Sit amet luctus venenatis lectus magna fringilla. Porttitor massa id neque aliquam. Ac odio tempor orci dapibus ultrices in iaculis. Vulputate sapien nec sagittis aliquam malesuada bibendum arcu vitae elementum. Integer vitae justo eget magna. Amet est placerat in egestas erat imperdiet sed euismod nisi. Ipsum dolor sit amet consectetur adipiscing elit duis tristique. Feugiat pretium nibh ipsum consequat nisl vel pretium lectus.

      Quis lectus nulla at volutpat diam ut venenatis tellus. Nascetur ridiculus mus mauris vitae ultricies leo integer. Blandit aliquam etiam erat velit. Nisi lacus sed viverra tellus in hac habitasse. Aliquam eleifend mi in nulla posuere. Malesuada bibendum arcu vitae elementum curabitur. Integer malesuada nunc vel risus commodo. Egestas tellus rutrum tellus pellentesque eu. Massa vitae tortor condimentum lacinia quis vel. Quis vel eros donec ac odio tempor orci. Massa tincidunt nunc pulvinar sapien et ligula ullamcorper. Diam sollicitudin tempor id eu. Purus in massa tempor nec feugiat nisl. Nulla facilisi etiam dignissim diam quis enim lobortis scelerisque.`,
    },

    {
      blogTitle: "Ornare Suspendisse Title",
      blogContent: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Massa tempor nec feugiat nisl pretium fusce. Enim diam vulputate ut pharetra sit. Tellus in hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Gravida dictum fusce ut placerat. Quis enim lobortis scelerisque fermentum dui faucibus. Urna et pharetra pharetra massa. Sed enim ut sem viverra aliquet. Neque gravida in fermentum et sollicitudin ac. Urna et pharetra pharetra massa massa ultricies mi quis hendrerit. Neque volutpat ac tincidunt vitae. Tellus pellentesque eu tincidunt tortor aliquam nulla facilisi. Vestibulum sed arcu non odio euismod. Ut tristique et egestas quis ipsum suspendisse.

      Ornare suspendisse sed nisi lacus sed viverra tellus. Vitae turpis massa sed elementum tempus egestas sed sed. Ac turpis egestas maecenas pharetra convallis. Adipiscing diam donec adipiscing tristique risus nec feugiat. Diam ut venenatis tellus in metus vulputate eu scelerisque felis. Praesent tristique magna sit amet purus. Etiam tempor orci eu lobortis elementum nibh tellus molestie. Mattis nunc sed blandit libero volutpat. Vel fringilla est ullamcorper eget nulla. Id aliquet lectus proin nibh nisl condimentum id. Sollicitudin tempor id eu nisl nunc mi. Risus pretium quam vulputate dignissim suspendisse in est ante in.`,
    },

    {
      blogTitle: "Massa Massa Title",
      blogContent: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut tristique et egestas quis ipsum suspendisse ultrices. Diam phasellus vestibulum lorem sed risus. Egestas purus viverra accumsan in nisl nisi scelerisque eu. Enim diam vulputate ut pharetra sit amet aliquam id diam. Vitae congue mauris rhoncus aenean vel. Pretium nibh ipsum consequat nisl vel pretium lectus quam. Quam id leo in vitae turpis massa sed. Ut etiam sit amet nisl purus. In arcu cursus euismod quis viverra nibh cras. Sit amet dictum sit amet justo. Sagittis eu volutpat odio facilisis mauris. Cras tincidunt lobortis feugiat vivamus at augue. Mattis pellentesque id nibh tortor id.

      Vitae tortor condimentum lacinia quis vel eros donec ac. Vestibulum lorem sed risus ultricies tristique nulla. Faucibus ornare suspendisse sed nisi lacus sed viverra. Lacus laoreet non curabitur gravida arcu. Amet nulla facilisi morbi tempus iaculis urna. Ac turpis egestas maecenas pharetra convallis posuere morbi leo urna. Aliquam ultrices sagittis orci a scelerisque purus. Non pulvinar neque laoreet suspendisse interdum consectetur. Donec adipiscing tristique risus nec feugiat in. Purus sit amet luctus venenatis lectus magna. Viverra tellus in hac habitasse platea dictumst. Urna et pharetra pharetra massa massa. Elit ut aliquam purus sit amet luctus.`,
    },

    {
      blogTitle: "Tempus Egestas Title",
      blogContent: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sed ullamcorper morbi tincidunt ornare massa eget egestas purus. Aliquet eget sit amet tellus cras adipiscing. Nibh venenatis cras sed felis eget velit. Malesuada nunc vel risus commodo viverra maecenas accumsan lacus. Augue mauris augue neque gravida in fermentum et. Id leo in vitae turpis massa sed. Nibh cras pulvinar mattis nunc sed blandit libero volutpat sed. Nulla facilisi etiam dignissim diam quis enim lobortis scelerisque. Sit amet consectetur adipiscing elit. Integer eget aliquet nibh praesent. Sit amet consectetur adipiscing elit duis tristique sollicitudin nibh. Viverra aliquet eget sit amet tellus cras. Odio eu feugiat pretium nibh. Risus nullam eget felis eget.

      Nibh nisl condimentum id venenatis. In egestas erat imperdiet sed euismod nisi porta lorem. Mauris in aliquam sem fringilla ut morbi. Nec nam aliquam sem et tortor. Hendrerit dolor magna eget est. Nunc faucibus a pellentesque sit amet porttitor. Ultricies mi eget mauris pharetra. Commodo ullamcorper a lacus vestibulum sed arcu non odio euismod. Ligula ullamcorper malesuada proin libero nunc consequat interdum. Elementum nibh tellus molestie nunc non blandit massa enim nec. A cras semper auctor neque vitae tempus quam pellentesque. Id nibh tortor id aliquet. Blandit massa enim nec dui nunc mattis. Elementum tempus egestas sed sed risus pretium quam vulputate.`,
    },

    {
      blogTitle: "Viverra Mauris Title",
      blogContent: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. At in tellus integer feugiat scelerisque varius morbi enim nunc. Hendrerit gravida rutrum quisque non tellus orci ac auctor. Ut venenatis tellus in metus vulputate. Magna etiam tempor orci eu. Quam pellentesque nec nam aliquam sem et tortor consequat. Est placerat in egestas erat imperdiet sed euismod nisi. Senectus et netus et malesuada fames ac turpis egestas. Amet facilisis magna etiam tempor orci eu lobortis elementum nibh. Tortor id aliquet lectus proin. Id eu nisl nunc mi ipsum. Sed cras ornare arcu dui vivamus arcu felis. Amet consectetur adipiscing elit duis tristique sollicitudin nibh sit amet.

      Nibh sit amet commodo nulla facilisi. Vulputate dignissim suspendisse in est ante in nibh mauris. Tellus in metus vulputate eu scelerisque felis imperdiet proin fermentum. Leo urna molestie at elementum. Est placerat in egestas erat imperdiet sed euismod. Augue neque gravida in fermentum et. Tortor posuere ac ut consequat semper viverra nam. Eu nisl nunc mi ipsum faucibus vitae. Mauris rhoncus aenean vel elit. Tincidunt augue interdum velit euismod in pellentesque massa. Velit egestas dui id ornare arcu odio ut sem. Id diam vel quam elementum pulvinar etiam non. Euismod in pellentesque massa placerat duis ultricies. Viverra mauris in aliquam sem fringilla ut morbi tincidunt augue. Netus et malesuada fames ac turpis. Et netus et malesuada fames.`,
    },
  ];

  try {
    const result = await this.insertMany(blogData);
    return result;
  } catch (err) {
    console.error(err);
  }
};

blogSchema.statics.getAllBlogs = async function () {
  try {
    const allBlogs = this.find();
    return allBlogs;
  } catch (err) {
    console.error(err);
  }
};

blogSchema.statics.countBlogData = async function () {
  try {
    const dataCount = await this.countDocuments();
    return dataCount;
  } catch (err) {
    console.error(err);
  }
};

// NodeJS-Pagination
blogSchema.statics.getBlogsPaginated = async function (
  currentPage,
  itemsPerPage
) {
  try {
    // NodeJS-Pagination
    // skip basically skips that many items in database.
    // lets say if you are on page 2 and if you want 5 items per page
    // (2-1)*5, it will skip the first 5 items and then start grabbing
    // but grabbing will be limited to 5 so it will grab the items from 6 to 10.
    const result = await this.find()
      .skip((currentPage - 1) * itemsPerPage)
      .limit(itemsPerPage);

    return result;
  } catch (err) {
    console.error(err);
  }
};

module.exports = mongoose.model("BlogTable", blogSchema);
